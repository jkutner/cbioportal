<%@ page import="java.util.Enumeration" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="org.mskcc.portal.util.MakeOncoPrint" %>

    <%
    
    // TODO: rename this file and other 'fingerprints' to OncoPrint, as that's our standard name

    // height of OncoPrint is roughly proportional to number of genes
    // using MakeOncoPrint.CELL_HEIGHT to avoid another constant
    // TODO: calculate height more carefully; best to use the 
    int height = 95 + (MakeOncoPrint.CELL_HEIGHT + 2) * geneWithScoreList.size();
    height += 200;

    StringBuffer tempUri = new StringBuffer("index.do?");
    Enumeration paramNames = request.getParameterNames();
    while (paramNames.hasMoreElements()) {
        String paramName = (String) paramNames.nextElement();
        String values[] = request.getParameterValues(paramName);
        for( String value: values){
            value = xssUtil.getCleanInput(value);
            tempUri.append(paramName + "=" + URLEncoder.encode(value.trim()) +"&");
        }
    }

    String fullURL = tempUri.toString() + "output=html&";

    %>
	<object data="<%= fullURL%>" class=oncoprint TYPE="text/html" WIDTH=800 HEIGHT=<%= height %> ></object>
