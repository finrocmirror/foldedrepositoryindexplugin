from trac.core import *
from trac.web import IRequestFilter
from trac.web.api import ITemplateStreamFilter
from trac.web.chrome import ITemplateProvider, \
                            add_script, add_script_data

from genshi.filters import Transformer

import os
import re

class FoldedRepositoryIndex(Component):
    """Adds folding by prefix to repository index.

    Repositories are collected into folded groups by mapping their names via
    regular expressions to custom labels. This mapping is defined in the
    `[folded-repository-index]` section of the [wiki:TracIni trac.ini] configuration
    file.

    Example:
    {{{
    [folded-repository-index]
    ^finroc_ = Finroc
    ^paper_(\d+)_ = Papers $1
    }}}
    """

    implements(IRequestFilter, ITemplateProvider, ITemplateStreamFilter)

    ### IRequestFilter methods
    def pre_process_request(self, req, handler):
        return handler

    def post_process_request(self, req, template, data, content_type):
        match = re.match(r'^/browser/?$', req.path_info)
        if match:
            config = self.config.options('folded-repository-index')
            add_script_data(req, { 'fri_config' : dict(config) })
            add_script(req, 'fri/folded_repository_index.js')
        return template, data, content_type

    ### ITemplateProvider methods
    def get_templates_dirs(self):
        return []

    def get_htdocs_dirs(self):
        from pkg_resources import resource_filename
        return [('fri', resource_filename(__name__, 'htdocs'))]

    ### ITemplateStreamFilter methods
    def filter_stream(self, req, method, filename, stream, data):
        match = re.match(r'^/browser/?$', req.path_info)
        if not match:
            return stream

        script_url = req.href('/chrome/common/js/expand_dir.js')
        filter = Transformer('//script[@src="' + script_url + '"]')
        return stream | filter.remove()
