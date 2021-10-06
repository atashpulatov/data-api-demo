import time

from framework.pages_base.base_page import BasePage
from framework.util.exception.mstr_exception import MstrException

from datetime import datetime


class TimeDurationPage(BasePage):

    SIMILARITY_THRESHOLD = 2

    KEY_START_TIME = 'start_time'
    KEY_DURATION = 'duration'
    KEY_DURATION_SUM = 'duration_sum'
    KEY_COUNTER = 'counter'

    KEY_TIMESTAMP = 'timestamp'

    def __init__(self):
        super().__init__()
        self.timers = {}
        self.timestamps = {}

    def save_execution_start(self, timer_name):
        if timer_name in self.timers:
            raise MstrException(f'Timer already started: {timer_name}')

        self.timers[timer_name] = {
            TimeDurationPage.KEY_START_TIME: time.time(),
            TimeDurationPage.KEY_COUNTER: 0,
            TimeDurationPage.KEY_DURATION_SUM: 0.0
        }

    def update_execution_start(self, timer_name):
        self._validate_timer_defined(timer_name)

        self.timers[timer_name][TimeDurationPage.KEY_START_TIME] = time.time()

    def save_duration_sum_and_counter(self, timer_name):
        """
        Calculates duration from timer_start adds to duration_sum and increments the counter
        """
        if timer_name not in self.timers:
            raise MstrException(f'Timer not started: {timer_name}')

        timer = self.timers[timer_name]

        duration = time.time() - timer[TimeDurationPage.KEY_START_TIME]
        timer[TimeDurationPage.KEY_DURATION] = duration

        timer[TimeDurationPage.KEY_DURATION_SUM] += duration

        timer[TimeDurationPage.KEY_COUNTER] = timer[TimeDurationPage.KEY_COUNTER] + 1

    def save_timestamp(self, timestamp_name):
        if timestamp_name in self.timestamps:
            raise MstrException(f'Timestamp already declared: {timestamp_name}')

        self.timestamps[timestamp_name] = {
            TimeDurationPage.KEY_TIMESTAMP: datetime.now()
        }

    def save_duration(self, timer_name):
        self._validate_timer_defined(timer_name)

        duration = time.time() - self.timers[timer_name][TimeDurationPage.KEY_START_TIME]

        self.timers[timer_name][TimeDurationPage.KEY_DURATION] = duration

    def is_execution_time_similar(self, first_timer_name, second_timer_name, threshold=SIMILARITY_THRESHOLD):
        first_timer_duration = self.get_timer_duration(first_timer_name)
        second_timer_duration = self.get_timer_duration(second_timer_name)

        duration_difference = abs(first_timer_duration - second_timer_duration)

        return duration_difference < threshold

    def is_execution_time_not_longer_than(self, first_timer_name, second_timer_name):
        """
        Checks if execution time measured by the first timer is NOT longer (is shorter or equal) than
        execution time measured by the second timer.

        :param first_timer_name: Timer representing expected shorted duration.
        :param second_timer_name: Timer representing expected longer duration.

        :return: True when first duration is shorter, False otherwise.
        """
        first_timer_duration = self.get_timer_duration(first_timer_name)
        second_timer_duration = self.get_timer_duration(second_timer_name)

        if first_timer_duration <= second_timer_duration:
            return True

        self.log(f'Execution time comparison error, first_timer_duration [{first_timer_duration}] '
                 f'is longer than second_timer_duration [{second_timer_duration}].')

        return False

    def get_timer_duration(self, timer_name):
        self._validate_timer(timer_name)

        return self.timers[timer_name][TimeDurationPage.KEY_DURATION]

    def get_timer_duration_sum(self, timer_name):
        self._validate_timer(timer_name)

        return self.timers[timer_name][TimeDurationPage.KEY_DURATION_SUM]

    def get_timestamp(self, timestamp_name):
        if timestamp_name not in self.timestamps:
            raise MstrException(f'Timestamp not declared: {timestamp_name}')

        return self.timestamps[timestamp_name][TimeDurationPage.KEY_TIMESTAMP]

    def get_execution_counter(self, timer_name):
        self._validate_timer_defined(timer_name)

        return self.timers[timer_name][TimeDurationPage.KEY_COUNTER]

    def _validate_timer_defined(self, timer_name):
        if timer_name not in self.timers:
            raise MstrException(f'Timer not started: {timer_name}')

    def _validate_timer(self, timer_name):
        self._validate_timer_defined(timer_name)

        if TimeDurationPage.KEY_DURATION not in self.timers[timer_name]:
            raise MstrException(f'Timer not stopped: {timer_name}')
