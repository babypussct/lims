export function levelForNotificationType(type) {
    if (type === 'REQUEST_APPROVED')
        return 'success';
    if (type === 'REQUEST_REJECTED')
        return 'error';
    if (type === 'STOCK_LOW_ALERT' || type === 'RETURN_OVERDUE')
        return 'warning';
    return 'info';
}
export function selectForegroundSurface(visibility, browserPermission) {
    if (visibility === 'visible')
        return 'toast';
    if (browserPermission === 'granted')
        return 'browser';
    return 'none';
}
/**
 * Resolve a metadata change without consulting the activity-log cache. The log
 * and metadata listeners are independent, so the latest cached log can be stale.
 */
export function resolveMetadataSyncToast(moduleKey, moduleVersion, rawEvent, currentUserUid, fallbackMessage) {
    const version = typeof moduleVersion === 'number' ? moduleVersion : Number(moduleVersion);
    const event = isMetadataSyncEvent(rawEvent) && rawEvent.version === version ? rawEvent : undefined;
    // The initiating screen already shows its own operation result.
    if (event?.actorUid && currentUserUid && event.actorUid === currentUserUid)
        return null;
    return {
        message: event?.message?.trim() || fallbackMessage,
        dedupeKey: event?.id?.trim() || `${moduleKey}-sync-${Number.isFinite(version) ? version : String(moduleVersion)}`
    };
}
function isMetadataSyncEvent(value) {
    if (!value || typeof value !== 'object')
        return false;
    const event = value;
    return typeof event['version'] === 'number';
}
//# sourceMappingURL=notification-policy.js.map