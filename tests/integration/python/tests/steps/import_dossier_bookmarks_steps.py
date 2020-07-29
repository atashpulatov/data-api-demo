from behave import *


@step('I selected dossier bookmark {bookmark_number}')
def step_impl(context, bookmark_number):
    context.pages.import_dossier_bookmarks_page().select_bookmark(bookmark_number)
