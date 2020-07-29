class MstrException(Exception):
    def __init__(self, msg):
        self.msg = msg

        super(MstrException, self).__init__(msg)
