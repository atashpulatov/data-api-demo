import time

from framework.pages_base.base_page import BasePage
from framework.util.exception.MstrException import MstrException


class TimeDurationPage(BasePage):
    TIMERS = {}

    SIMILARITY_THRESHOLD = 2

    KEY_START_TIME = 'start_time'
    KEY_DURATION = 'duration'

    def save_execution_start(self, timer_name):
        if timer_name in TimeDurationPage.TIMERS:
            raise MstrException(f'Timer already started: {timer_name}')

        TimeDurationPage.TIMERS[timer_name] = {
            TimeDurationPage.KEY_START_TIME: time.time()
        }

    def save_duration(self, timer_name):
        if timer_name not in TimeDurationPage.TIMERS:
            raise MstrException(f'Timer not started: {timer_name}')

        duration = time.time() - TimeDurationPage.TIMERS[timer_name][TimeDurationPage.KEY_START_TIME]

        TimeDurationPage.TIMERS[timer_name][TimeDurationPage.KEY_DURATION] = duration

    def is_execution_time_similar(self, first_timer_name, second_timer_name, threshold=SIMILARITY_THRESHOLD):
        first_timer_duration = self._get_timer_duration(first_timer_name)
        second_timer_duration = self._get_timer_duration(second_timer_name)

        duration_difference = abs(first_timer_duration - second_timer_duration)

        return duration_difference < threshold

    def is_execution_time_not_longer_than(self, first_timer_name, second_timer_name):
        first_timer_duration = self._get_timer_duration(first_timer_name)
        second_timer_duration = self._get_timer_duration(second_timer_name)

        return second_timer_duration >= first_timer_duration

    def _get_timer_duration(self, timer_name):
        self._validate_timer(timer_name)

        return TimeDurationPage.TIMERS[timer_name][TimeDurationPage.KEY_DURATION]

    def _validate_timer(self, timer_name):
        if timer_name not in TimeDurationPage.TIMERS:
            raise MstrException(f'Timer not started: {timer_name}')

        if TimeDurationPage.KEY_DURATION not in TimeDurationPage.TIMERS[timer_name]:
            raise MstrException(f'Timer not stopped: {timer_name}')
