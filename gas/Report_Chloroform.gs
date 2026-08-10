function generateCustomReport_chloroform_gcms(templateId, metadata, samples, folder, fileName, version) {
  return generateCustomSingleAnalyteType2Report(
    templateId,
    metadata,
    samples,
    folder,
    fileName,
    'chloroform-gcms',
    'ChloroformCustom',
  );
}
