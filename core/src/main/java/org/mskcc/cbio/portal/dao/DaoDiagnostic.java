/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.mskcc.cbio.portal.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.mskcc.cbio.portal.model.Diagnostic;

/**
 *
 * @author jgao
 */
public final class DaoDiagnostic {
    private DaoDiagnostic() {
        throw new AssertionError("DaoDiagnostic should not be instanciated");
    }
    
    public static int addDatum(Diagnostic diagnostic) {
        if (!MySQLbulkLoader.isBulkLoad()) {
            throw new IllegalStateException("Only buld load mode is allowed for importing diagnostic data");
        }
        
        MySQLbulkLoader.getMySQLbulkLoader("diagnostic").insertRecord(
                Long.toString(diagnostic.getDiagosticId()),
                Integer.toString(diagnostic.getCancerStudyId()),
                diagnostic.getCaseId(),
                Integer.toString(diagnostic.getDate()),
                diagnostic.getType(),
                diagnostic.getSide(),
                diagnostic.getTarget(),
                diagnostic.getResult(),
                diagnostic.getStatus()
                );
        return 1;
    }
    
    public static void deleteByCancerStudyId(int cancerStudyId) throws DaoException {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            con = JdbcUtil.getDbConnection(DaoDiagnostic.class);
            pstmt = con.prepareStatement("DELETE FROM diagnostic WHERE CANCER_STUDY_ID=?");
            pstmt.setInt(1, cancerStudyId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            throw new DaoException(e);
        } finally {
            JdbcUtil.closeAll(DaoDiagnostic.class, con, pstmt, rs);
        }
    }
}