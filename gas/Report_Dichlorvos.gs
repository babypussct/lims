function generateCustomReport_dichlorvos_gcms(templateId, metadata, samples, folder, fileName, version) {
  return generateCustomSingleAnalyteType2Report(
    templateId,
    metadata,
    samples,
    folder,
    fileName,
    'dichlorvos-gcms',
    'DichlorvosCustom',
  );
}
