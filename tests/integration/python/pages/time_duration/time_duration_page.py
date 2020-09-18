from framework.pages_base.base_page import BasePage
from framework.util.exception.MstrException import MstrException
import time
 
class TimeDurationPage(BasePage):

    TIMERS = {}
    SIMILAR_THRESHOLD = 2
    
    KEY_START_TIME = 'start_time'
    KEY_DURATION = 'duration'

    def save_execution_start(self, timer_name):
        if timer_name in TimeDurationPage.TIMERS:
            raise MstrException(f'Timer already started: {timer_name}')

        TimeDurationPage.TIMERS[timer_name] = {
            TimeDurationPage.KEY_START_TIME: time.time()
        }

    def save_execution_end(self, timer_name):
        if timer_name not in TimeDurationPage.TIMERS:
            raise MstrException(f'Timer not started: {timer_name}')
        
        duration = time.time() - TimeDurationPage.TIMERS[timer_name][TimeDurationPage.KEY_START_TIME] 

        TimeDurationPage.TIMERS[timer_name][TimeDurationPage.KEY_DURATION] = duration

    def is_execution_time_similar(self, first_timer_name, second_timer_name, threshold=SIMILAR_THRESHOLD):
        self._validate_timer(first_timer_name)
        self._validate_timer(second_timer_name)

        first_timer_duration = TimeDurationPage.TIMERS[first_timer_name][TimeDurationPage.KEY_DURATION] 
        second_timer_duration =TimeDurationPage.TIMERS[second_timer_name][TimeDurationPage.KEY_DURATION]
        
        duration_difference = abs(first_timer_duration - second_timer_duration)

        return duration_difference < threshold

    def _validate_timer(self, timer_name):
        if timer_name not in TimeDurationPage.TIMERS:
            raise MstrException(f'Timer not started: {timer_name}')
        
        if TimeDurationPage.KEY_DURATION not in TimeDurationPage.TIMERS[timer_name]:
            raise MstrException(f'Timer not stoped: {timer_name}')

    def is_execution_time_not_bigger_than(self, shorter_timer_name, longer_timer_name):
        self._validate_timer(shorter_timer_name)
        self._validate_timer(longer_timer_name)

        shorter_timer_duration = TimeDurationPage.TIMERS[shorter_timer_name][TimeDurationPage.KEY_DURATION] 
        longer_timer_duration =TimeDurationPage.TIMERS[longer_timer_name][TimeDurationPage.KEY_DURATION]
        
        return longer_timer_duration >= shorter_timer_duration
