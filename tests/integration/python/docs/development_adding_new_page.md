# Adding a new Page

To add a new Page implementing Page Object Model:

1. Implement the Page, e.g. `pages/right_panel/right_panel_tile/right_panel_tile_browser_page.py`:
    ```python
    (...)
    class RightPanelTileBrowserPage(BaseBrowserPage):
        (...)
        def close_last_notification_on_hover(self):
            self.focus_on_add_in_frame()
    
            self._hover_over_tile(0)
        (...)
    ```

1. Add information about the Page to all Page Sets to make it available:

    - `pages_factory/abstract_pages.py` (abstract class implemented by all Page Sets, no implementation here), e.g.:
        ```python
        @abstractmethod
        def right_panel_tile_page(self):
            pass
        ```
    - `pages_factory/pages_*.py` (it's necessary to add appropriate method definition to all Page Sets)
       - when Page is implemented for a given Page Set:
        ```python
        from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage
        (...)
        class PagesSetBrowser(AbstractPagesSet):
            def __init__(self):
                super().__init__()
                (...)
                self.right_panel_tile_browser_page = RightPanelTileBrowserPage()
                (...)
    
            def import_data_page(self):
                return self.import_data_browser_page
        ``` 
       - when Page is not yet implemented for a given Page Set:
        ```python
            def import_data_page(self):
                pass
        ``` 

1. Add Steps file corresponding to newly added Page to `tests/steps`, e.g. `tests/steps/right_side_panel_tile_steps.py`:

    ```python
    from behave import *
    
    
    @step('I closed last notification')
    def step_impl(context):
        context.pages.right_panel_tile_page().close_last_notification_on_hover()

    ``` 
