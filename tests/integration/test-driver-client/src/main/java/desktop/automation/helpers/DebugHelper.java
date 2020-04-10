package desktop.automation.helpers;

public class DebugHelper {
    private static int count = 0;

    public static void here(String message){
        System.out.println("here " + count++ + " " + message);
    }

    public static void here(){
        here("");
    }
}
