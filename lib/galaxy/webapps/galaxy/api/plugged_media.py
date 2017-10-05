"""
API operations on Plugged Media.

.. see also:: :class:`galaxy.model.PluggedMedia`
"""
import logging

from galaxy import web
from galaxy.managers import (
    users,
    plugged_media
)
from galaxy.web.base.controller import BaseAPIController

log = logging.getLogger(__name__)


class PluggedMediaController(BaseAPIController):
    """
    RESTful controller for interactions with plugged media.
    """

    def __init__(self, app):
        super(PluggedMediaController, self).__init__(app)
        self.user_manager = users.UserManager(app)
        self.plugged_media_manager = plugged_media.PluggedMediaManager(app)
        self.plugged_media_serializer = plugged_media.PluggedMediaSerializer(app)


    @web.expose_api_anonymous
    def index(self, trans, **kwd):
        """
        GET /api/plugged_media: returns a list of installed plugged media
        """
        user = self.user_manager.current_user(trans)
        if self.user_manager.is_anonymous(user):
            # an anonymous user is not expected to have installed a plugged media.
            return []
        # TODO: iterate through the plugged media and show its content manually avoiding secret and access key
        return user.plugged_media

    @web.expose_api_anonymous
    def create(self, trans, payload, **kwd):
        """

        :type  trans: galaxy.web.framework.webapp.GalaxyWebTransaction
        :param trans: Galaxy web transaction.

        :type  payload: dict
        :param payload: a dictionary structure containing the following keys:
            - hierarchy: A key which defines the hierarchical relation between this and other plugged media defined
            by the user.
            - category: is the type of this plugged media, its value is a key from `categories` bunch defined in the
            `PluggedMedia` class.
            - path: a path in the plugged media to be used (e.g., AWS S3 Bucket name).
            - access_key: (Optional) credentials to access the plugged media.
            - secret_key: (Optional) credentials to access the plugged media.
        :return: the newly created plugged media.
        """
        if not isinstance(payload, dict):
            trans.response.status = 400
            return "Invalid payload data type. The payload is expected to be a dictionary," \
                   " but received data of type '%s'." % str(type(payload))

        missing_arguments = []
        hierarchy = payload.get("hierarchy")
        if hierarchy is None:
            missing_arguments.append("hierarchy")
        category = payload.get("category")
        if category is None:
            missing_arguments.append("category")
        path = payload.get("path")
        if path is None:
            missing_arguments.append("path")
        if len(missing_arguments) > 0:
            trans.response.status = 400
            return "The following arguments are missing in the payload: %s" % missing_arguments

        new_plugged_media = self.plugged_media_manager.create(
            user_id=trans.user.id,
            hierarchy=hierarchy,
            category=category,
            path=path,
            access_key=payload.get("access_key", None),
            secret_key=payload.get("secret_key", None))

        try:
            view = self.plugged_media_serializer.serialize_to_view(
                new_plugged_media, user=trans.user, trans=trans, **self._parse_serialization_params(kwd, 'summary'))
            # Do not use integer response codes (e.g., 200), as they are not accepted by the
            # 'wsgi_status' function in lib/galaxy/web/framework/base.py
            trans.response.status = '200 OK'
            log.debug('Created a new plugged media of type `%s` for the user id `%s` ', category, str(trans.user.id))
            return view
        except Exception, e:
            log.exception('An unexpected error occurred while responding to the '
                          'create request of the plugged media API. ' + str(e))
            # Do not use integer response code (see above).
            trans.response.status = '500 Internal Server Error'
            return []