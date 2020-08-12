@step('I pressed key {key_name}')
def step_impl(context, key_name):
    context.pages.keyboard_page().press_key(key_name)
