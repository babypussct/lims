import { formatSampleList } from './src/app/shared/utils/utils.ts';

console.log('Result for simple:', formatSampleList(["M01", "M02", "M03", "M05"]));
console.log('Result for suffix:', formatSampleList(["M01-2024", "M02-2024", "M03-2024", "M05-2024"]));
