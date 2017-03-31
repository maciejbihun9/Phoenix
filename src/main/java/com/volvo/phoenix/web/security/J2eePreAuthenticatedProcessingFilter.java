package com.volvo.phoenix.web.security;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

/**
 * This AbstractPreAuthenticatedProcessingFilter implementation is based on the
 * J2EE container-based authentication mechanism. It will use the J2EE user
 * principal name as the pre-authenticated principal.
 * Additionally, the user principal in the format <userid>@VCN.DS.VOLVO.NET ,set by JBoss Kerberos module is stripped to leave just <userid>
 *
 * @author bpl3195
 */
public class J2eePreAuthenticatedProcessingFilter extends AbstractPreAuthenticatedProcessingFilter {

    /**
     * Return the J2EE user name.
     */
    protected Object getPreAuthenticatedPrincipal(HttpServletRequest httpRequest) {
        String principal = httpRequest.getUserPrincipal() == null ? null : httpRequest.getUserPrincipal().getName();
        // strip realm information if available (JBoss provides this, WAS does not)
        if (principal != null && principal.contains("@")) {
            principal = principal.substring(0, principal.indexOf('@'));
        }
        if (logger.isDebugEnabled()) {
            logger.debug("PreAuthenticated J2EE principal: " + principal);
        }
        return principal;
    }

    /**
     * For J2EE container-based authentication there is no generic way to
     * retrieve the credentials, as such this method returns a fixed dummy
     * value.
     */
    protected Object getPreAuthenticatedCredentials(HttpServletRequest httpRequest) {
        return "N/A";
    }
}
