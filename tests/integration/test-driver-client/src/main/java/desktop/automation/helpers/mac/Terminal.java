package desktop.automation.helpers.mac;

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

    public static boolean isExcelProcessRunning(){
        try {
            Process p = Runtime.getRuntime().exec(new String[]{"/bin/sh", "-c", "ps -e | grep Excel | wc -l"});
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));

            String line;
            while ((line = br.readLine()) == null) {
                Thread.sleep(500);
            }

            return Integer.parseInt(line.trim()) > 1;
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("failed to assert whether Excel process is running", e);
        }
    }
}
