#!/usr/bin/python
# coding=utf8

from setuptools import find_packages, setup

version = '0.1'

setup(
    name='FoldedRepositoryIndex',
#      version = ,
    description="Adds folding by prefix to Trac's repository index",
    author='Tobias Föhst',
    author_email='foehst@finroc.org',
#      url = 'URL',
#      keywords = 'trac plugin',
    license="GPL",
    packages=find_packages(exclude=['*.tests*']),
    include_package_data=True,
    package_data={
        'folded_repository_index': [
            'htdocs/*.js',
            ]
        },
    zip_safe=True,
    entry_points={
        'trac.plugins': [
            'folded_repository_index.web_ui = folded_repository_index.web_ui',
        ]
    }
)
