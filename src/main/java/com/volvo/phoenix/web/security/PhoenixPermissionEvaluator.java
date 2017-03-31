package com.volvo.phoenix.web.security;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;

import com.volvo.phoenix.document.security.DomainPermissionEvaluator;


/**
 *  Spring security. Application's custom evaluator of user's permissions
 */
public class PhoenixPermissionEvaluator implements PermissionEvaluator {

    private static final Logger LOGGER = LoggerFactory.getLogger(PhoenixPermissionEvaluator.class);
    
    /**
     * Collection of domain permission evaluators.
     */
    private List<DomainPermissionEvaluator> delegatedDomainPermissionEvaluators = new ArrayList<DomainPermissionEvaluator>();
    
    public void setDelegatedDomainPermissionEvaluators(List<DomainPermissionEvaluator> delegatedDomainPermissionEvaluators) {
        this.delegatedDomainPermissionEvaluators = delegatedDomainPermissionEvaluators;
    }
    
    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        DomainPermissionEvaluator domainEvaluator = findDomainDelegate(targetDomainObject.getClass());
        return domainEvaluator.hasPermission(authentication, targetDomainObject, permission);
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        DomainPermissionEvaluator domainEvaluator = null;
        try {
            domainEvaluator = findDomainDelegate(Class.forName(targetType));
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
        return domainEvaluator.hasPermission(authentication, targetId, targetType, permission);     
    }
    
    private DomainPermissionEvaluator findDomainDelegate(Class<?> targetClass) {
        for (DomainPermissionEvaluator domainDelegate : delegatedDomainPermissionEvaluators) {
            LOGGER.debug("checking delegate {}", domainDelegate.getClass());
            if (domainDelegate.supports(targetClass)) {
                LOGGER.debug("Found matching delegate {}", domainDelegate.getClass());
                return domainDelegate;
            }    
        }
        return null;
    }

}
