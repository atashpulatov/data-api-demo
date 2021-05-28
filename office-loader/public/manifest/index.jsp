<%@ page import="java.security.MessageDigest,java.security.NoSuchAlgorithmException,java.util.Objects,java.util.UUID"
%><%@ page import="java.nio.charset.StandardCharsets" %><%!
    private static class UUIDType5 {
        private static final UUID NAMESPACE = UUID.fromString("94a1c4bb-9a81-a8b9-f9b0-0fa57409f25b");
        private static final String MESSAGE_DIGEST_SHA_1 = "SHA-1";

        private static UUID nameUUIDFromUrl(String url) {
            final String urlNotNull = Objects.requireNonNull(url, "url is null");

            final MessageDigest md = prepareMessageDigest(urlNotNull);

            final byte[] bytes = prepareMicroStrategyData(md);

            return fromBytes(bytes);
        }

        private static MessageDigest prepareMessageDigest(String url) {
            final MessageDigest md;
            try {
                md = MessageDigest.getInstance(MESSAGE_DIGEST_SHA_1);
            } catch (NoSuchAlgorithmException e) {
                throw new InternalError("SHA-1 not supported");
            }

            final byte[] namespaceBytes = toBytes(NAMESPACE);
            md.update(namespaceBytes);

            final String urlLowerCase = url.toLowerCase();
            final byte[] urlBytes = urlLowerCase.getBytes(StandardCharsets.UTF_8);
            md.update(urlBytes);

            return md;
        }

        private static byte[] prepareMicroStrategyData(MessageDigest md) {
            final byte[] bytes = md.digest();

            bytes[6] &= 0x0f; // clear version
            bytes[6] |= 0x50; // set to version 5
            bytes[8] &= 0x3f; // clear variant
            bytes[8] |= 0x80; // set to IETF variant

            return bytes;
        }

        private static UUID fromBytes(byte[] data) {
            // Based on the private UUID(bytes[]) constructor
            assert data.length >= 16;
            long msb = 0;
            for (int i = 0; i < 8; i++) {
                msb = (msb << 8) | (data[i] & 0xff);
            }
            long lsb = 0;
            for (int i = 8; i < 16; i++) {
                lsb = (lsb << 8) | (data[i] & 0xff);
            }
            return new UUID(msb, lsb);
        }

        private static byte[] toBytes(UUID uuid) {
            // inverted logic of fromBytes()
            final byte[] out = new byte[16];
            long msb = uuid.getMostSignificantBits();
            for (int i = 0; i < 8; i++) {
                out[i] = (byte) ((msb >> ((7 - i) * 8)) & 0xff);
            }
            long lsb = uuid.getLeastSignificantBits();
            for (int i = 8; i < 16; i++) {
                out[i] = (byte) ((lsb >> ((15 - i) * 8)) & 0xff);
            }
            return out;
        }
    }

    private static class ManifestXmlCreator {
        private static final String MANIFEST_XML_TEMPLATE = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "  <OfficeApp xmlns=\"http://schemas.microsoft.com/office/appforoffice/1.1\"\n" +
                "      xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n" +
                "      xmlns:bt=\"http://schemas.microsoft.com/office/officeappbasictypes/1.0\"\n" +
                "      xmlns:ov=\"http://schemas.microsoft.com/office/taskpaneappversionoverrides\" xsi:type=\"TaskPaneApp\">\n" +
                "      <Id>%s</Id>\n" +
                "      <Version>%s</Version>\n" +
                "      <ProviderName>MicroStrategy Inc.</ProviderName>\n" +
                "      <DefaultLocale>en-US</DefaultLocale>\n" +
                "      <DisplayName DefaultValue=\"MicroStrategy for Office\"/>\n" +
                "      <Description DefaultValue=\"New plugin to insert data from MicroStrategy into Microsoft Office products.\">\n" +
                "          <Override Locale=\"da-dk\" Value=\"Nyt plugin til at indsætte data fra Microstrategy i Microsoft Office-produkter.\"/>\n" +
                "          <Override Locale=\"de-de\" Value=\"Neues Plug-in zur Datenübertragung aus Microstrategy in Microsoft-Office-Produkte.\"/>\n" +
                "          <Override Locale=\"en-gb\" Value=\"New plugin to insert data from MicroStrategy into Microsoft Office products.\"/>\n" +
                "          <Override Locale=\"en-us\" Value=\"New plugin to insert data from MicroStrategy into Microsoft Office products.\"/>\n" +
                "          <Override Locale=\"es-es\" Value=\"Nuevo complemento para insertar datos de MicroStrategy en productos de Microsoft Office.\"/>\n" +
                "          <Override Locale=\"fr-fr\" Value=\"Nouveau plugin pour insérer des données depuis MicroStrategy vers des produits Microsoft Office.\"/>\n" +
                "          <Override Locale=\"it-it\" Value=\"Nuovo plugin per inserire dati da MicroStrategy nei prodotti MicroStrategy per Office.\"/>\n" +
                "          <Override Locale=\"ja-jp\" Value=\"MicrostrategyからMicrosoft Office製品にデータを挿入するための新しいプラグイン。\"/>\n" +
                "          <Override Locale=\"ko-kr\" Value=\"Microstrategy에서 Microsoft Office 제품으로 데이터를 삽입하는 새 플러그인입니다.\"/>\n" +
                "          <Override Locale=\"nl-nl\" Value=\"Nieuwe plug-in om gegevens van Microstrategy in Microsoft Office-producten te voegen.\"/>\n" +
                "          <Override Locale=\"pl-pl\" Value=\"Nowa wtyczka do wprowadzania danych z MicroStrategy do produktów pakietu Microsoft Office.\"/>\n" +
                "          <Override Locale=\"pt-br\" Value=\"Novo plugin para inserir dados do MicroStrategy em produtos Microsoft Office.\"/>\n" +
                "          <Override Locale=\"sv-se\" Value=\"Ny plugin för att infoga data från Microstrategy i Microsoft Office-produkter.\"/>\n" +
                "          <Override Locale=\"zh-cn\" Value=\"将数据从 MicroStrategy 插入到 Microsoft Office 产品的新插件。\"/>\n" +
                "          <Override Locale=\"zh-tw\" Value=\"將資料從 Microstrategy 插入 Microsoft Office 產品的新外掛程式。\"/>\n" +
                "      </Description>\n" +
                "      <IconUrl DefaultValue=\"%s/mstr_logo_32.png\"/>\n" +
                "      <HighResolutionIconUrl DefaultValue=\"%s/mstr_logo_512.png\"/>\n" +
                "      <SupportUrl DefaultValue=\"https://www2.microstrategy.com/producthelp/Current/Office/WebHelp/Lang_1033/index.htm\"/>\n" +
                "      <Hosts>\n" +
                "          <Host Name=\"Workbook\"/>\n" +
                "      </Hosts>\n" +
                "      <Requirements>\n" +
                "        <Sets>\n" +
                "          <Set Name=\"ExcelApi\" MinVersion=\"1.4\"/>\n" +
                "        </Sets>\n" +
                "      </Requirements>\n" +
                "      <DefaultSettings>\n" +
                "          <SourceLocation DefaultValue=\"%s/index.html\"/>\n" +
                "      </DefaultSettings>\n" +
                "      <Permissions>ReadWriteDocument</Permissions>\n" +
                "      <VersionOverrides xmlns=\"http://schemas.microsoft.com/office/taskpaneappversionoverrides\" xsi:type=\"VersionOverridesV1_0\">\n" +
                "          <Hosts>\n" +
                "              <Host xsi:type=\"Workbook\">\n" +
                "                  <DesktopFormFactor>\n" +
                "                      <GetStarted>\n" +
                "                          <Title resid=\"MSTR.GetStarted.Title\"/>\n" +
                "                          <Description resid=\"MSTR.GetStarted.Description\"/>\n" +
                "                          <LearnMoreUrl resid=\"MSTR.GetStarted.LearnMoreUrl\"/>\n" +
                "                      </GetStarted>\n" +
                "                      <FunctionFile resid=\"MSTR.DesktopFunctionFile.Url\"/>\n" +
                "                      <ExtensionPoint xsi:type=\"PrimaryCommandSurface\">\n" +
                "                          <OfficeTab id=\"TabHome\">\n" +
                "                              <Group id=\"MSTR.Group1\">\n" +
                "                                  <Label resid=\"MSTR.GroupMicroStrategy.Label\"/>\n" +
                "                                  <Icon>\n" +
                "                                      <bt:Image size=\"16\" resid=\"MSTR.tpicon_16x16\"/>\n" +
                "                                      <bt:Image size=\"32\" resid=\"MSTR.tpicon_32x32\"/>\n" +
                "                                      <bt:Image size=\"80\" resid=\"MSTR.tpicon_80x80\"/>\n" +
                "                                  </Icon>\n" +
                "                                  <Control xsi:type=\"Button\" id=\"MSTR.TaskpaneButton\">\n" +
                "                                      <Label resid=\"MSTR.TaskpaneButton.Label\"/>\n" +
                "                                      <Supertip>\n" +
                "                                          <Title resid=\"MSTR.TaskpaneButton.Label\"/>\n" +
                "                                          <Description resid=\"MSTR.TaskpaneButton.Tooltip\"/>\n" +
                "                                      </Supertip>\n" +
                "                                      <Icon>\n" +
                "                                          <bt:Image size=\"16\" resid=\"MSTR.tpicon_16x16\"/>\n" +
                "                                          <bt:Image size=\"32\" resid=\"MSTR.tpicon_32x32\"/>\n" +
                "                                          <bt:Image size=\"80\" resid=\"MSTR.tpicon_80x80\"/>\n" +
                "                                      </Icon>\n" +
                "                                      <Action xsi:type=\"ShowTaskpane\">\n" +
                "                                          <TaskpaneId>TaskPaneMainButton</TaskpaneId>\n" +
                "                                          <SourceLocation resid=\"MSTR.Taskpane.Url\"/>\n" +
                "                                      </Action>\n" +
                "                                  </Control>\n" +
                "                              </Group>\n" +
                "                          </OfficeTab>\n" +
                "                      </ExtensionPoint>\n" +
                "                  </DesktopFormFactor>\n" +
                "              </Host>\n" +
                "          </Hosts>\n" +
                "          <Resources>\n" +
                "              <bt:Images>\n" +
                "                  <bt:Image id=\"MSTR.tpicon_16x16\" DefaultValue=\"%s/mstr_logo_16.png\"/>\n" +
                "                  <bt:Image id=\"MSTR.tpicon_32x32\" DefaultValue=\"%s/mstr_logo_32.png\"/>\n" +
                "                  <bt:Image id=\"MSTR.tpicon_80x80\" DefaultValue=\"%s/mstr_logo_80.png\"/>\n" +
                "              </bt:Images>\n" +
                "              <bt:Urls>\n" +
                "                  <bt:Url id=\"MSTR.Taskpane.Url\" DefaultValue=\"%s/index.html\"/>\n" +
                "                  <bt:Url id=\"MSTR.GetStarted.LearnMoreUrl\" DefaultValue=\"https://go.microsoft.com/fwlink/?LinkId=276812\"/>\n" +
                "                  <bt:Url id=\"MSTR.DesktopFunctionFile.Url\" DefaultValue=\"%s/function-file/function-file.html\"/>\n" +
                "              </bt:Urls>\n" +
                "              <bt:ShortStrings>\n" +
                "                  <bt:String id=\"MSTR.TaskpaneButton.Label\" DefaultValue=\"MicroStrategy for Office\"/>\n" +
                "                  <bt:String id=\"MSTR.GroupMicroStrategy.Label\" DefaultValue=\"MicroStrategy\"/>\n" +
                "                  <bt:String id=\"MSTR.GetStarted.Title\" DefaultValue=\"MicroStrategy for Office\"/>\n" +
                "                  <bt:String id=\"MSTR.OfficeTab.Label\" DefaultValue=\"MicroStrategy\"/>\n" +
                "              </bt:ShortStrings>\n" +
                "              <bt:LongStrings>\n" +
                "                  <bt:String id=\"MSTR.TaskpaneButton.Tooltip\" DefaultValue=\"Click to Show a Taskpane\">\n" +
                "                      <bt:Override Locale=\"da-dk\" Value=\"Klik for at vise et opgavepanel\"/>\n" +
                "                      <bt:Override Locale=\"de-de\" Value=\"Hier klicken, um Aufgabenbereich anzuzeigen\"/>\n" +
                "                      <bt:Override Locale=\"en-gb\" Value=\"Click to Show a Taskpane\"/>\n" +
                "                      <bt:Override Locale=\"en-us\" Value=\"Click to Show a Taskpane\"/>\n" +
                "                      <bt:Override Locale=\"es-es\" Value=\"Haga clic para mostrar un panel de tareas\"/>\n" +
                "                      <bt:Override Locale=\"fr-fr\" Value=\"Cliquez pour afficher un volet de tâches\"/>\n" +
                "                      <bt:Override Locale=\"it-it\" Value=\"Fare clic per mostrare un riquadro attività\"/>\n" +
                "                      <bt:Override Locale=\"ja-jp\" Value=\"[Show a Taskpane]をクリック\"/>\n" +
                "                      <bt:Override Locale=\"ko-kr\" Value=\"클릭하여 작업창 표시\"/>\n" +
                "                      <bt:Override Locale=\"nl-nl\" Value=\"Klik om een taakvenster weer te geven\"/>\n" +
                "                      <bt:Override Locale=\"pl-pl\" Value=\"Kliknij, aby wyświetlić okienko zadań\"/>\n" +
                "                      <bt:Override Locale=\"pt-br\" Value=\"Clique para mostrar um painel de tarefas\"/>\n" +
                "                      <bt:Override Locale=\"sv-se\" Value=\"Klicka för att visa ett åtgärdsfönster\"/>\n" +
                "                      <bt:Override Locale=\"zh-cn\" Value=\"单击以显示任务窗格\"/>\n" +
                "                      <bt:Override Locale=\"zh-tw\" Value=\"按一下以顯示一個 Taskpane\"/>\n" +
                "                  </bt:String>\n" +
                "                  <bt:String id=\"MSTR.GetStarted.Description\" DefaultValue=\"Click MicroStrategy for Office on Home tab to start plugin.\"/>\n" +
                "              </bt:LongStrings>\n" +
                "          </Resources>\n" +
                "      </VersionOverrides>\n" +
                "  </OfficeApp>";

        private static final String URL_STATIC = "/static/";
        private static final String URL_SUFFIX_EXCEL = "/static/loader-mstr-office/index.html";
        private static final String URL_PATH = "/static/loader-mstr-office";
        private static final String URL_ASSETS = "/assets";
        private static final String APPLICATION_VERSION = "0.0.1";

        private static String getXml(String url) {
            final String environmentUrl = url.split(URL_STATIC)[0];
            final String loaderUrl = environmentUrl + URL_PATH;
            final String assetsUrl = loaderUrl + URL_ASSETS;

            final String excelIndexUrl = environmentUrl + URL_SUFFIX_EXCEL;

            final String uuid = UUIDType5.nameUUIDFromUrl(excelIndexUrl).toString();

            return String.format(
                    MANIFEST_XML_TEMPLATE,
                    uuid,
                    APPLICATION_VERSION,
                    assetsUrl,
                    assetsUrl,
                    loaderUrl,
                    assetsUrl,
                    assetsUrl,
                    assetsUrl,
                    loaderUrl,
                    loaderUrl
            );
        }
    }
%><%
    final String CONTENT_TYPE = "APPLICATION/OCTET-STREAM";
    final String CONTENT_DISPOSITION_KEY = "Content-Disposition";
    final String CONTENT_DISPOSITION_FILE_NAME_VALUE = "attachment; filename=\"MicroStrategy for Office.xml\"";

    final String url = request.getRequestURL().toString();
    final String manifestXml = ManifestXmlCreator.getXml(url);

    response.setContentType(CONTENT_TYPE);
    response.setHeader(CONTENT_DISPOSITION_KEY, CONTENT_DISPOSITION_FILE_NAME_VALUE);

    out.write(manifestXml);
%>