/**
 * Builds one immutable, completed historical checkout record plus its linked
 * usage log. Firestore timestamps are added by the service at write time.
 */
export function buildStandardBackfillRecords(input) {
    if (!input.requestId || !input.logId)
        throw new Error('Thiếu mã hồ sơ nhập bù.');
    if (!input.standard.id)
        throw new Error('Chuẩn không có mã định danh.');
    if (!input.employeeUid || !input.employeeName.trim())
        throw new Error('Thiếu người sử dụng chuẩn.');
    if (!input.enteredByUid || !input.enteredByName.trim())
        throw new Error('Thiếu người nhập bù.');
    if (!Number.isFinite(input.eventTimestamp) || input.eventTimestamp <= 0) {
        throw new Error('Ngày sử dụng nhập bù không hợp lệ.');
    }
    if (!Number.isFinite(input.backfilledAt) || input.backfilledAt <= 0) {
        throw new Error('Thời điểm nhập bù không hợp lệ.');
    }
    if (!Number.isFinite(input.amountUsed) || input.amountUsed <= 0) {
        throw new Error('Lượng sử dụng phải lớn hơn 0.');
    }
    if (!Number.isFinite(input.normalizedAmount) || input.normalizedAmount <= 0) {
        throw new Error('Lượng sử dụng quy đổi phải lớn hơn 0.');
    }
    if (!input.purpose.trim())
        throw new Error('Mục đích sử dụng là bắt buộc.');
    const usageLog = {
        id: input.logId,
        date: new Date(input.eventTimestamp).toISOString(),
        timestamp: input.eventTimestamp,
        user: input.employeeName.trim(),
        userId: input.employeeUid,
        amount_used: input.amountUsed,
        unit: input.usageUnit,
        normalized_amount: input.normalizedAmount,
        normalized_unit: input.stockUnit,
        purpose: input.purpose.trim(),
        standardId: input.standard.id,
        standardName: input.standard.name,
        lotNumber: input.standard.lot_number,
        cas_number: input.standard.cas_number,
        internalId: input.standard.internal_id,
        manufacturer: input.standard.manufacturer,
        requestId: input.requestId,
        isDepleted: input.isDepleted,
        isBackfill: true,
        backfilledAt: input.backfilledAt,
        backfilledByUid: input.enteredByUid,
        backfilledByName: input.enteredByName.trim()
    };
    const request = {
        id: input.requestId,
        standardId: input.standard.id,
        standardName: input.standard.name,
        lotNumber: input.standard.lot_number,
        requestedBy: input.employeeUid,
        requestedByName: input.employeeName.trim(),
        requestDate: input.eventTimestamp,
        purpose: input.purpose.trim(),
        expectedAmount: input.normalizedAmount,
        status: 'COMPLETED',
        approvedBy: input.enteredByUid,
        approvedByName: input.enteredByName.trim(),
        approvalDate: input.eventTimestamp,
        returnDate: input.eventTimestamp,
        receivedBy: input.enteredByUid,
        receivedByName: input.enteredByName.trim(),
        totalAmountUsed: input.normalizedAmount,
        confirmedAmountUsed: input.normalizedAmount,
        confirmedUnit: input.stockUnit,
        reportedDepleted: input.isDepleted,
        usageLogs: [usageLog],
        isBackfill: true,
        backfilledAt: input.backfilledAt,
        backfilledByUid: input.enteredByUid,
        backfilledByName: input.enteredByName.trim(),
        createdAt: input.eventTimestamp,
        updatedAt: input.backfilledAt,
        _isDeleted: false
    };
    return { usageLog, request };
}
//# sourceMappingURL=standard-backfill.js.map