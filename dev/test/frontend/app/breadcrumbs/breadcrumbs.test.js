import Breadcrumbs from '../../../../src/frontend/app/breadcrumbs/breadcrumbs-component';
import BreadcrumService from '../../../../src/frontend/app/breadcrumbs/breadcrumb-service';

describe.skip('Breadcrumbs', () => {
    beforeAll(()=> {
        BreadcrumService.getHistory = jest
        .fn()
        .mockImplementation(() => {
            return [
                {},
                {},
            ];
        });
    });
    it('should render one breadcrumb', () => {
        // given
        const historyArray = BreadcrumService.getHistory();
        // when
        const componentWrapper = mount(<Breadcrumbs history={historyArray} />);
        // then
        const breadcrumbContainer = componentWrapper.find('ul');
        expect(breadcrumbContainer.hasClass('breadcrumbsContainer'));
        expect(breadcrumbContainer).toHaveLength(2);
    });
});
