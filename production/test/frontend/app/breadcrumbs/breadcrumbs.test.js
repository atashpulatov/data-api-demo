/* eslint-disable */
import { Breadcrumbs } from '../../../../src/frontend/app/breadcrumbs/breadcrumbs.jsx';
import { breadcrumbsService } from '../../../../src/frontend/app/breadcrumbs/breadcrumb-service';
/* eslint-enable */

describe.skip('Breadcrumbs', () => {
    beforeAll(() => {
        breadcrumbsService.getHistory = jest
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
