# Adding support for a new platform

To add support for a new platform it's necessary to configure a new driver and create and configure a new Pages Set.

1. New driver:

    - in `framework/driver/driver_new_platform.py` add `DriverNewPlatform` class implementing `AbstractDriver`  
    - add appropriate constants to `framework/driver/driver_type.py`
    - register new driver class in `DriverFactory` in `framework/driver/driver_factory.py`
   
1. New Pages Set:
    - in `pages_set/pages_set_new_platform.py` add `PagesSetNewPlatform` class implementing `AbstractPagesSet`
    - register new Pages Set in `PagesSetFactory` in `pages_set/pages_set_factory.py` 
