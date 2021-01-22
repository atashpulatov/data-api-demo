class CommonDebugOnFailure:
    USAGE_TYPE_STEP = 'step'
    USAGE_TYPE_SCENARIO = 'scenario'

    def prepare_debug_file_name_prefix(self, debug_file_type, usage_type, status_name, name):
        return f'{debug_file_type}_{usage_type}_{status_name}_{name[:30]}_'
