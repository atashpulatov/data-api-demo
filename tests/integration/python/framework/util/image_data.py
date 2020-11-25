from framework.util.exception.MstrException import MstrException


class ImageData:
    """
    Class responsible for storing image data information. Used by ImageElement related code (e.g. Windows Desktop image
    recognition).
    """

    __image = None
    __image_name = None
    __coordinates = None
    __center_coordinates = None
    __size = None

    def __init__(self, image, image_name, coordinates):
        self.__image = image
        self.__image_name = image_name
        self.__coordinates = coordinates

        self.__size = {
            'width': coordinates['right'] - coordinates['left'],
            'height': coordinates['bottom'] - coordinates['top']
        }

        self.__center_coordinates = {
            'x': coordinates['left'] + int(self.__size['width'] / 2),
            'y': coordinates['top'] + int(self.__size['height'] / 2)
        }

    @property
    def image(self):
        if self.__image is None:
            raise MstrException('ImageData was not initialized correctly, image is None')

        return self.__image

    @property
    def image_name(self):
        if self.__image_name is None:
            raise MstrException('ImageData was not initialized correctly, image_name is None')

        return self.__image_name

    @property
    def coordinates(self):
        if self.__coordinates is None:
            raise MstrException('ImageData was not initialized correctly, coordinates is None')

        return self.__coordinates

    @property
    def center_coordinates(self):
        if self.__center_coordinates is None:
            raise MstrException('ImageData was not initialized correctly, center_coordinates is None')

        return self.__center_coordinates

    @property
    def size(self):
        if self.__size is None:
            raise MstrException('ImageData was not initialized correctly, size is None')

        return self.__size
