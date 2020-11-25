from behave import *


@step('I selected dossier bookmark {bookmark_number}')
def step_impl(context, bookmark_number):
    context.pages.import_dossier_bookmarks_page().select_bookmark(bookmark_number)


@step('I created dossier bookmark "{bookmark_name}" if not exists')
def step_impl(context, bookmark_name):
    context.pages.import_dossier_bookmarks_page().create_bookmark_if_not_exists(bookmark_name)
