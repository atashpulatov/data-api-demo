package desktop.automation.exceptions;

import org.opencv.core.Mat;

public class ImageBasedElemNotFound extends RuntimeException{

    public ImageBasedElemNotFound() {
    }

    public ImageBasedElemNotFound(Mat mat) {
        super("Cannot find image, Mat object for image: " + mat);
    }
}
