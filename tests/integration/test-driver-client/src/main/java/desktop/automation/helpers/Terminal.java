package desktop.automation.helpers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Terminal {

    private static Process startProcess(String cmd) throws IOException {
        String[] runnableCmd = {"/bin/sh", "-c",
                cmd};
        return Runtime.getRuntime().exec(runnableCmd);
    }

    private static String getPIDOfExcelProcess() throws IOException {
        //adb -s LMX4107HLVIBRGKJWC shell ps | grep screenrecord
        String cmd = "ps A | grep Excel";

        Process process = startProcess(cmd);
        BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));

        String pid;
        while ((pid = in.readLine()) != null)
            if (pid.contains("Microsoft Excel"))
                return pid.split("\\s+")[1];

        return null;
    }

    public static void terminateMacExcelProcess() throws IOException {
        String pid = getPIDOfExcelProcess();
        String cmd = String.format("kill -14 %s", pid);
        Terminal.startProcess(cmd);

        while (getPIDOfExcelProcess() != null);
    }
}
