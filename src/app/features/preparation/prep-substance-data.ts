/**
 * Common laboratory reagent index for offline use. Rows contain:
 * formula | Vietnamese name | international synonyms | optional species | optional CAS | optional physical form.
 * Formula and molecular weight are validated/calculated by the preparation parser.
 * Physical form, purity, stock concentration and density must be checked for each lot.
 */
export const LAB_REAGENT_GROUPS = [
  { id: 'acid_base', label: 'Axit, bazơ và chất oxy hóa', rows: `
KOH|Kali hydroxid|potassium hydroxide potash||1310-58-3
Ca(OH)2|Calci hydroxid|calcium hydroxide vôi tôi
Ba(OH)2.8H2O|Bari hydroxid octahydrat|barium hydroxide octahydrate|Ba(OH)2
Mg(OH)2|Magnesi hydroxid|magnesium hydroxide
H3BO3|Axit boric|boric acid||10043-35-3
H2C2O4.2H2O|Axit oxalic dihydrat|oxalic acid dihydrate|H2C2O4|6153-56-6
C6H8O7|Axit citric khan|citric acid anhydrous||77-92-9
C6H8O7.H2O|Axit citric monohydrat|citric acid monohydrate|C6H8O7|5949-29-1
C4H6O6|Axit tartaric|tartaric acid
C2H2O4|Axit oxalic khan|oxalic acid anhydrous
C2HCl3O2|Axit trichloroacetic|trichloroacetic acid TCA
C7H6O2|Axit benzoic|benzoic acid
HIO3|Axit iodic|iodic acid
H3NSO3|Axit sulfamic|sulfamic acid amidosulfonic acid
K2CrO4|Kali cromat|potassium chromate|Cr
KBrO3|Kali bromat|potassium bromate
KIO3|Kali iodat|potassium iodate
KIO4|Kali periodat|potassium periodate
NaClO2|Natri clorit|sodium chlorite
NaClO3|Natri clorat|sodium chlorate
Na2S2O8|Natri persulfat|sodium persulfate peroxydisulfate
K2S2O8|Kali persulfat|potassium persulfate
(NH4)2S2O8|Amoni persulfat|ammonium persulfate APS
Na2O2|Natri peroxid|sodium peroxide
NaHSO3|Natri bisulfit|sodium bisulfite hydrogen sulfite
Na2S2O5|Natri metabisulfit|sodium metabisulfite
Na2S2O4|Natri dithionit|sodium dithionite hydrosulfite
LiOH.H2O|Liti hydroxid monohydrat|lithium hydroxide monohydrate|LiOH|1310-66-3
Sr(OH)2.8H2O|Stronti hydroxid octahydrat|strontium hydroxide octahydrate|Sr(OH)2
H2SeO3|Axit selenơ|selenious acid selenium(IV) acid
NH3O.HCl|Hydroxylamin hydroclorid|hydroxylamine hydrochloride hydrochloride salt||5470-11-1
NaClO|Natri hypoclorit|sodium hypochlorite nước javel||7681-52-9|liquid
KClO|Kali hypoclorit|potassium hypochlorite||7778-66-7
NaBrO3|Natri bromat|sodium bromate||7789-38-0
NaIO3|Natri iodat|sodium iodate||7681-55-2
KHSO4|Kali bisulfat|potassium hydrogen sulfate potassium bisulfate||7646-93-7
NaHSO4.H2O|Natri bisulfat monohydrat|sodium bisulfate monohydrate|NaHSO4
CaO|Calci oxid|calcium oxide vôi sống||1305-78-8
MgO|Magnesi oxid|magnesium oxide||1309-48-4
HBr|Axit hydrobromic|hydrobromic acid hydrogen bromide||10035-10-6|liquid` },
  { id: 'salts', label: 'Muối vô cơ và khoáng', rows: `
KCl|Kali clorid|potassium chloride||7447-40-7
CaCl2|Calci clorid khan|calcium chloride anhydrous||10043-52-4
CaCl2.2H2O|Calci clorid dihydrat|calcium chloride dihydrate|CaCl2
MgCl2.6H2O|Magnesi clorid hexahydrat|magnesium chloride hexahydrate|MgCl2
NH4Cl|Amoni clorid|ammonium chloride
BaCl2.2H2O|Bari clorid dihydrat|barium chloride dihydrate|Ba BaCl2
FeCl3.6H2O|Sắt(III) clorid hexahydrat|ferric chloride iron(III) chloride|Fe FeCl3
FeCl2.4H2O|Sắt(II) clorid tetrahydrat|ferrous chloride iron(II) chloride|Fe FeCl2
ZnCl2|Kẽm clorid|zinc chloride|Zn
CuCl2.2H2O|Đồng(II) clorid dihydrat|copper(II) chloride dihydrate|Cu CuCl2
SnCl2.2H2O|Thiếc(II) clorid dihydrat|stannous chloride tin(II) chloride|Sn SnCl2
Na2SO4|Natri sulfat khan|sodium sulfate anhydrous
Na2SO4.10H2O|Natri sulfat decahydrat|sodium sulfate decahydrate glauber salt|Na2SO4
K2SO4|Kali sulfat|potassium sulfate
MgSO4|Magnesi sulfat khan|magnesium sulfate anhydrous
MgSO4.7H2O|Magnesi sulfat heptahydrat|magnesium sulfate heptahydrate epsom salt|MgSO4|10034-99-8
Fe2(SO4)3|Sắt(III) sulfat|ferric sulfate iron(III) sulfate|Fe
ZnSO4.7H2O|Kẽm sulfat heptahydrat|zinc sulfate heptahydrate|Zn ZnSO4
MnSO4.H2O|Mangan sulfat monohydrat|manganese sulfate monohydrate|Mn MnSO4
NiSO4.6H2O|Niken sulfat hexahydrat|nickel sulfate hexahydrate|Ni NiSO4
CoSO4.7H2O|Coban sulfat heptahydrat|cobalt sulfate heptahydrate|Co CoSO4
Al2(SO4)3.18H2O|Nhôm sulfat octadecahydrat|aluminium sulfate aluminum sulfate|Al Al2(SO4)3
(NH4)2SO4|Amoni sulfat|ammonium sulfate
NaNO3|Natri nitrat|sodium nitrate
KNO3|Kali nitrat|potassium nitrate
Ca(NO3)2.4H2O|Calci nitrat tetrahydrat|calcium nitrate tetrahydrate|Ca Ca(NO3)2
Mg(NO3)2.6H2O|Magnesi nitrat hexahydrat|magnesium nitrate hexahydrate|Mg(NO3)2
Pb(NO3)2|Chì(II) nitrat|lead nitrate|Pb
NH4NO3|Amoni nitrat|ammonium nitrate
NaNO2|Natri nitrit|sodium nitrite
KNO2|Kali nitrit|potassium nitrite
Na2CO3.10H2O|Natri carbonat decahydrat|sodium carbonate decahydrate washing soda|Na2CO3
NaHCO3|Natri bicarbonat|sodium hydrogen carbonate sodium bicarbonate baking soda||144-55-8
K2CO3|Kali carbonat|potassium carbonate
KHCO3|Kali bicarbonat|potassium bicarbonate hydrogen carbonate
MgCO3|Magnesi carbonat|magnesium carbonate
NaF|Natri fluorid|sodium fluoride|F
KF|Kali fluorid|potassium fluoride|F
NaBr|Natri bromid|sodium bromide|Br
KBr|Kali bromid|potassium bromide|Br
KI|Kali iodid|potassium iodide|I
NaI|Natri iodid|sodium iodide|I
Na2S.9H2O|Natri sulfid nonahydrat|sodium sulfide nonahydrate|Na2S
Na2SO3|Natri sulfit|sodium sulfite
Na2S2O3|Natri thiosulfat khan|sodium thiosulfate anhydrous||7772-98-7
KSCN|Kali thiocyanat|potassium thiocyanate|SCN
NH4SCN|Amoni thiocyanat|ammonium thiocyanate|SCN
Na2SiO3.9H2O|Natri silicat nonahydrat|sodium metasilicate nonahydrate|Na2SiO3
Na2B4O7.10H2O|Borax decahydrat|sodium tetraborate decahydrate borax|Na2B4O7|1303-96-4
Na2B4O7.5H2O|Borax pentahydrat|sodium tetraborate pentahydrate|Na2B4O7
CuSO4|Đồng(II) sulfat khan|copper sulfate anhydrous cupric sulfate|Cu
FeSO4|Sắt(II) sulfat khan|iron(II) sulfate anhydrous ferrous sulfate|Fe
NiCl2.6H2O|Niken clorid hexahydrat|nickel chloride hexahydrate|Ni NiCl2
CoCl2.6H2O|Coban clorid hexahydrat|cobalt chloride hexahydrate|Co CoCl2
Cu(NO3)2.3H2O|Đồng(II) nitrat trihydrat|copper nitrate trihydrate|Cu Cu(NO3)2
Ag2SO4|Bạc sulfat|silver sulfate|Ag
Na2MoO4.2H2O|Natri molybdat dihydrat|sodium molybdate dihydrate|Mo Na2MoO4
(NH4)6Mo7O24.4H2O|Amoni heptamolybdat tetrahydrat|ammonium heptamolybdate tetrahydrate|Mo
KAl(SO4)2.12H2O|Phèn chua kali|potassium alum potassium aluminium sulfate dodecahydrate|Al
Na3PO4.12H2O|Trinatri phosphat dodecahydrat|trisodium phosphate dodecahydrate|Na3PO4
K3PO4|Trikali phosphat|tripotassium phosphate
NH4H2PO4|Amoni dihydrogen phosphat|ammonium dihydrogen phosphate MAP
Na3C6H5O7.2H2O|Trinatri citrat dihydrat|trisodium citrate dihydrate|Na3C6H5O7
Na3C6H5O7|Trinatri citrat khan|trisodium citrate anhydrous
LiCl|Liti clorid|lithium chloride||7447-41-8
Li2CO3|Liti carbonat|lithium carbonate||554-13-2
SrCl2.6H2O|Stronti clorid hexahydrat|strontium chloride hexahydrate|SrCl2
Sr(NO3)2|Stronti nitrat|strontium nitrate||10042-76-9
Ba(NO3)2|Bari nitrat|barium nitrate||10022-31-8
BaSO4|Bari sulfat|barium sulfate||7727-43-7
CaSO4.2H2O|Calci sulfat dihydrat|calcium sulfate dihydrate gypsum|CaSO4|10101-41-4
Ca3(PO4)2|Tricalci phosphat|tricalcium phosphate calcium phosphate
CaHPO4.2H2O|Dicalci phosphat dihydrat|dicalcium phosphate dihydrate|CaHPO4|7789-77-7
AlCl3.6H2O|Nhôm clorid hexahydrat|aluminum chloride hexahydrate|Al AlCl3|7784-13-6
Al(NO3)3.9H2O|Nhôm nitrat nonahydrat|aluminium nitrate nonahydrate|Al Al(NO3)3|7784-27-2
Al(OH)3|Nhôm hydroxid|aluminum hydroxide aluminium hydroxide|Al
Zn(NO3)2.6H2O|Kẽm nitrat hexahydrat|zinc nitrate hexahydrate|Zn Zn(NO3)2|10196-18-6
ZnO|Kẽm oxid|zinc oxide|Zn|1314-13-2
Fe(NO3)3.9H2O|Sắt(III) nitrat nonahydrat|ferric nitrate nonahydrate|Fe Fe(NO3)3|7782-61-8
CuO|Đồng(II) oxid|cupric oxide copper oxide|Cu|1317-38-0
Cu2O|Đồng(I) oxid|cuprous oxide copper(I) oxide|Cu|1317-39-1
MnCl2.4H2O|Mangan(II) clorid tetrahydrat|manganese(II) chloride tetrahydrate|Mn MnCl2|13446-34-9
MnO2|Mangan dioxid|manganese dioxide|Mn|1313-13-9
Co(NO3)2.6H2O|Coban nitrat hexahydrat|cobalt nitrate hexahydrate|Co Co(NO3)2|10026-22-9
Ni(NO3)2.6H2O|Niken nitrat hexahydrat|nickel nitrate hexahydrate|Ni Ni(NO3)2|13478-00-7
CrCl3.6H2O|Crom(III) clorid hexahydrat|chromium(III) chloride hexahydrate|Cr CrCl3|10060-12-5
Cr(NO3)3.9H2O|Crom(III) nitrat nonahydrat|chromium(III) nitrate nonahydrate|Cr Cr(NO3)3|7789-02-8
Na2Cr2O7.2H2O|Natri dicromat dihydrat|sodium dichromate dihydrate|Cr Na2Cr2O7|7789-12-0
Pb(CH3COO)2.3H2O|Chì(II) acetat trihydrat|lead acetate trihydrate|Pb Pb(CH3COO)2|6080-56-4
CdCl2|Cadmi clorid khan|cadmium chloride anhydrous|Cd|10108-64-2
Cd(NO3)2.4H2O|Cadmi nitrat tetrahydrat|cadmium nitrate tetrahydrate|Cd Cd(NO3)2|10022-68-1
HgCl2|Thủy ngân(II) clorid|mercuric chloride mercury(II) chloride|Hg|7487-94-7
Na2WO4.2H2O|Natri tungstat dihydrat|sodium tungstate dihydrate|W Na2WO4|10213-10-2
Bi(NO3)3.5H2O|Bismut nitrat pentahydrat|bismuth nitrate pentahydrate|Bi Bi(NO3)3|10035-06-0
SbCl3|Antimon(III) clorid|antimony trichloride|Sb|10025-91-9
Sb2O3|Antimon(III) oxid|antimony trioxide|Sb|1309-64-4
Zn(CH3COO)2.2H2O|Kẽm acetat dihydrat|zinc acetate dihydrate|Zn Zn(CH3COO)2|5970-45-6
Cu(CH3COO)2.H2O|Đồng(II) acetat monohydrat|copper acetate monohydrate|Cu Cu(CH3COO)2|6046-93-1
(NH4)2HPO4|Diamoni hydrogen phosphat|diammonium hydrogen phosphate DAP
Na4P2O7.10H2O|Natri pyrophosphat decahydrat|tetrasodium pyrophosphate decahydrate|Na4P2O7|13472-36-1
Na5P3O10|Natri tripolyphosphat|sodium tripolyphosphate STPP||7758-29-4
K4P2O7|Kali pyrophosphat|tetrapotassium pyrophosphate||7320-34-5
NH4F|Amoni fluorid|ammonium fluoride||12125-01-8
NH4HF2|Amoni bifluorid|ammonium bifluoride ammonium hydrogen difluoride||1341-49-7
K2S2O5|Kali metabisulfit|potassium metabisulfite||16731-55-8
K2SO3|Kali sulfit|potassium sulfite||10117-38-1
NaClO4.H2O|Natri perclorat monohydrat|sodium perchlorate monohydrate|NaClO4|7791-07-3
KClO4|Kali perclorat|potassium perchlorate||7778-74-7` },
  { id: 'buffers', label: 'Đệm, chuẩn độ và tạo phức', rows: `
K2HPO4|Dikali hydrogen phosphat|dipotassium hydrogen phosphate dibasic buffer
NaH2PO4|Natri dihydrogen phosphat khan|sodium phosphate monobasic buffer
NaH2PO4.H2O|Natri dihydrogen phosphat monohydrat|sodium phosphate monobasic monohydrate buffer|NaH2PO4
NaH2PO4.2H2O|Natri dihydrogen phosphat dihydrat|sodium phosphate monobasic dihydrate buffer|NaH2PO4
Na2HPO4|Dinatri hydrogen phosphat khan|disodium hydrogen phosphate dibasic anhydrous buffer
Na2HPO4.2H2O|Dinatri hydrogen phosphat dihydrat|disodium phosphate dibasic dihydrate buffer|Na2HPO4
Na2HPO4.7H2O|Dinatri hydrogen phosphat heptahydrat|disodium phosphate dibasic heptahydrate buffer|Na2HPO4
CH3COONa|Natri acetat khan|sodium acetate anhydrous buffer
CH3COOK|Kali acetat|potassium acetate buffer
NH4CH3COO|Amoni acetat|ammonium acetate HPLC LCMS buffer
NH4HCO3|Amoni bicarbonat|ammonium bicarbonate buffer LCMS
C10H16N2O8|EDTA dạng axit|ethylenediaminetetraacetic acid EDTA free acid
C10H12N2Na4O8.4H2O|EDTA tetranatri tetrahydrat|tetrasodium EDTA tetrahydrate|C10H12N2Na4O8
C4H4KNaO6.4H2O|Muối Rochelle tetrahydrat|potassium sodium tartrate tetrahydrate|C4H4KNaO6
KHC8H4O4|Kali hydrogen phthalat|potassium hydrogen phthalate KHP primary standard
K2C2O4.H2O|Kali oxalat monohydrat|potassium oxalate monohydrate|K2C2O4
(NH4)2Fe(SO4)2.6H2O|Muối Mohr hexahydrat|ammonium iron(II) sulfate ferrous ammonium sulfate FAS|Fe (NH4)2Fe(SO4)2
NH4Fe(SO4)2.12H2O|Sắt(III) amoni sulfat dodecahydrat|ferric ammonium sulfate iron alum|Fe NH4Fe(SO4)2
K4[Fe(CN)6].3H2O|Kali ferrocyanid trihydrat|potassium hexacyanoferrate(II) trihydrate|K4[Fe(CN)6]
K3[Fe(CN)6]|Kali ferricyanid|potassium hexacyanoferrate(III)
Na2C2O4|Natri oxalat|sodium oxalate primary standard
C4H11NO3|Tris base|tris hydroxymethyl aminomethane tromethamine TRIS buffer
C4H12ClNO3|Tris hydrochlorid|tris hydrochloride TRIS HCl buffer
C8H18N2O4S|HEPES|hepes zwitterionic buffer
C6H11NaO7|Natri gluconat|sodium gluconate||527-07-1
C4H5NaO4|Natri hydrogen succinat|monosodium succinate sodium acid succinate
Na2C4H4O4|Dinatri succinat|disodium succinate sodium succinate
C6H13NO4S|MES|morpholinoethanesulfonic acid MES buffer||4432-31-9
C7H15NO4S|MOPS|morpholinopropanesulfonic acid MOPS buffer||1132-61-2
C6H5K3O7|Trikali citrat khan|tripotassium citrate anhydrous
C3H5NaO3|Natri lactat|sodium lactate||72-17-3|liquid` },
  { id: 'indicators', label: 'Chỉ thị và thuốc thử', rows: `
I2|Iod|iodine iot thuốc thử
C20H14O4|Phenolphthalein|phenolphthalein pp indicator chỉ thị||77-09-8
C14H14N3NaO3S|Methyl orange|methyl orange sodium salt chỉ thị||547-58-0
C21H14Br4O5S|Bromocresol green|bromocresol green chỉ thị
C27H28Br2O5S|Bromothymol blue|bromothymol blue BTB chỉ thị
C20H12N3NaO7S|Eriochrome black T|eriochrome black t EBT chỉ thị độ cứng
C9H7NO|8-Hydroxyquinolin|8 hydroxyquinoline oxine thuốc thử
C12H8N2|1,10-Phenanthrolin|1 10 phenanthroline orthophenanthroline thuốc thử sắt
C13H14N4O|Diphenylcarbazid|1 5 diphenylcarbazide DPC thuốc thử Cr(VI)||140-22-7
C6H8N2|p-Phenylenediamin|para phenylenediamine PPD
C15H15N3O2|Methyl red|methyl red chỉ thị đỏ methyl||493-52-7
C32H22N6Na2O6S2|Congo red|congo red chỉ thị đỏ Congo||573-58-0
C12H8N2.H2O|1,10-Phenanthrolin monohydrat|1 10 phenanthroline monohydrate|C12H8N2
C13H12N4S|Dithizon|dithizone diphenylthiocarbazone thuốc thử kim loại
C19H10Br4O5S|Bromophenol blue|bromophenol blue BPB chỉ thị||115-39-9
C21H16Br2O5S|Bromocresol purple|bromocresol purple BCP chỉ thị||115-40-2
C28H30O4|Thymolphthalein|thymolphthalein chỉ thị||125-20-2
C27H30O5S|Thymol blue|thymol blue chỉ thị||76-61-9
C20H12O5|Fluorescein|fluorescein uranine thuốc thử||2321-07-5
C16H18ClN3S|Methylene blue khan|methylene blue anhydrous chỉ thị||61-73-4
C23H25ClN2|Malachite green clorid|malachite green chloride thuốc nhuộm||569-64-2
C14H7NaO7S|Alizarin red S|alizarin red S sodium salt chỉ thị||130-22-3
C12H11N|Diphenylamin|diphenylamine chỉ thị oxy hóa khử||122-39-4` },
  { id: 'organic', label: 'Hợp chất hữu cơ và chất chuẩn', rows: `
C6H12O6|Glucose khan|D-glucose dextrose anhydrous đường glucose
C6H12O6.H2O|Glucose monohydrat|dextrose monohydrate|C6H12O6
C12H22O11|Sucrose|saccharose sucrose đường mía
C6H14O6|Sorbitol|sorbitol glucitol
C6H8O6|Axit ascorbic|ascorbic acid vitamin C
C7H5NaO2|Natri benzoat|sodium benzoate chất bảo quản
C6H7KO2|Kali sorbat|potassium sorbate chất bảo quản
C6H8O2|Axit sorbic|sorbic acid
C7H6O3|Axit salicylic|salicylic acid
CH4N2O|Ure|urea carbamide
C2H5NO2|Glycin|glycine amino acetic acid
C3H7NO2|Alanin|alanine amino acid
C5H11NO2|Valin|valine amino acid
C3H7NO3|Serin|serine amino acid
C8H9NO2|Paracetamol|acetaminophen paracetamol
C9H8O4|Aspirin|acetylsalicylic acid aspirin ASA
C8H10N4O2|Caffein|caffeine cafein
C8H8O3|Vanillin|vanillin hương vani
C8H8O3|Methylparaben|methyl paraben methyl 4 hydroxybenzoate chất bảo quản||99-76-3
C10H12O3|Propylparaben|propyl paraben propyl 4 hydroxybenzoate chất bảo quản||94-13-3
C4H6O5|Axit malic|malic acid
C4H6O4|Axit succinic|succinic acid
C2H4O2|Axit acetic|acetic acid ethanoic acid||64-19-7|liquid
C3H6O2|Axit propionic|propionic acid||79-09-4|liquid
C4H8O2|Axit butyric|butyric acid butanoic acid||107-92-6|liquid
C6H12O6|Fructose|D-fructose levulose đường fructose||57-48-7
C6H12O6|Galactose|D-galactose đường galactose||59-23-4
C5H10O5|Ribose|D-ribose đường ribose||50-69-1
C5H10O5|Xylose|D-xylose đường xylose||58-86-6
C12H22O11.H2O|Lactose monohydrat|lactose monohydrate đường lactose|C12H22O11|64044-51-5
C12H22O11|Maltose khan|maltose anhydrous đường maltose
C6H14O6|Mannitol|D-mannitol mannitol||69-65-8
C6H12O6|Myo-inositol|inositol myo inositol||87-89-8
C6H6O|Phenol|phenol carbolic acid||108-95-2
C6H6O2|Resorcinol|resorcinol benzene-1,3-diol||108-46-3
C6H6O2|Hydroquinon|hydroquinone benzene-1,4-diol||123-31-9
C6H6O2|Catechol|catechol pyrocatechol benzene-1,2-diol||120-80-9
C5H4N4O3|Axit uric|uric acid||69-93-2
C6H5NO2|Axit nicotinic|nicotinic acid niacin vitamin B3||59-67-6
C5H9NO4|Axit glutamic|glutamic acid||56-86-0
C6H14N2O2|Lysin|lysine amino acid||56-87-1
C9H11NO2|Phenylalanin|phenylalanine amino acid||63-91-2
C11H12N2O2|Tryptophan|tryptophan amino acid||73-22-3
C5H11NO2S|Methionin|methionine amino acid||63-68-3
C3H7NO2S|Cystein|cysteine amino acid||52-90-4
C4H7NO4|Axit aspartic|aspartic acid amino acid||56-84-8
C4H9NO3|Threonin|threonine amino acid||72-19-5
C2H7NO3S|Taurin|taurine||107-35-7
C3H5NaO2|Natri propionat|sodium propionate chất bảo quản||137-40-6
Ca(C3H5O2)2|Calci propionat|calcium propionate chất bảo quản||4075-81-4
C7H4NNaO3S.2H2O|Natri saccharin dihydrat|sodium saccharin dihydrate chất tạo ngọt|C7H4NNaO3S|6155-57-3` },
  { id: 'solvents', label: 'Dung môi và hóa chất lỏng', rows: `
CH3OH|Methanol|methanol methyl alcohol cồn metylic||67-56-1
C2H5OH|Ethanol|ethanol ethyl alcohol cồn etylic cồn 96||64-17-5
C3H8O|Isopropanol|2-propanol isopropyl alcohol IPA||67-63-0
C3H8O|n-Propanol|1-propanol n propyl alcohol||71-23-8
C3H6O|Aceton|acetone propanone||67-64-1
C2H3N|Acetonitril|acetonitrile ACN MeCN HPLC LCMS||75-05-8
C4H8O2|Etyl acetat|ethyl acetate EtOAc solvent||141-78-6
C6H14|n-Hexan|n hexane hexane solvent||110-54-3
C7H16|n-Heptan|n heptane heptane
C5H12|n-Pentan|n pentane pentane
C6H12|Cyclohexan|cyclohexane
C7H8|Toluen|toluene methylbenzene||108-88-3
C6H6|Benzen|benzene
C8H10|Xylen|xylene dimethylbenzene hỗn hợp đồng phân
CH2Cl2|Dicloromethan|dichloromethane methylene chloride DCM||75-09-2
CHCl3|Cloroform|chloroform trichloromethane||67-66-3
CCl4|Cacbon tetraclorid|carbon tetrachloride tetrachloromethane
C4H8O|Tetrahydrofuran|tetrahydrofuran THF||109-99-9
C4H10O|Dietyl ete|diethyl ether ethoxyethane
C3H7NO|Dimethylformamid|dimethylformamide DMF
C2H6OS|Dimethyl sulfoxid|dimethyl sulfoxide DMSO||67-68-5
C5H9NO|N-Metyl-2-pyrrolidon|N methyl 2 pyrrolidone NMP
C4H10O|n-Butanol|1-butanol butyl alcohol
C5H12O|Isoamyl alcohol|isopentyl alcohol 3-methyl-1-butanol
C4H6O3|Propylen carbonat|propylene carbonate solvent||108-32-7
C3H6O3|Dimetyl carbonat|dimethyl carbonate DMC||616-38-6
C4H8O|Metyl etyl keton|methyl ethyl ketone MEK 2-butanone||78-93-3
C5H12O|Metyl tert-butyl ete|methyl tert butyl ether MTBE||1634-04-4
C2H4Cl2|1,2-Dicloroethan|1 2 dichloroethane ethylene dichloride
C2HCl3|Tricloroethylen|trichloroethylene TCE
C2Cl4|Tetracloroethylen|tetrachloroethylene perchloroethylene PCE
CH3NO2|Nitromethan|nitromethane
C4H8O2|1,4-Dioxan|1 4 dioxane
CH2O2|Axit formic lỏng|formic acid FA LCMS solvent modifier||64-18-6
C3H8O3|Glycerol|glycerin glycerol glycerine
C2H6O2|Ethylene glycol|ethylene glycol ethanediol
C3H8O2|Propylene glycol|propylene glycol propanediol
C3H6O3|Axit lactic lỏng|lactic acid
C2H7NO|Ethanolamin|ethanolamine monoethanolamine MEA
C8H18|n-Octan|n octane octane||111-65-9
C8H18|Isooctan|2 2 4 trimethylpentane isooctane||540-84-1
C10H22|n-Decan|n decane decane||124-18-5
C12H26|n-Dodecan|n dodecane dodecane||112-40-3
C4H10O|sec-Butanol|2-butanol sec butyl alcohol||78-92-2
C4H10O|tert-Butanol|tert butanol t butyl alcohol||75-65-0
C3H6O2|Metyl acetat|methyl acetate||79-20-9
C6H12O2|n-Butyl acetat|butyl acetate n butyl acetate||123-86-4
C5H10O2|n-Propyl acetat|propyl acetate n propyl acetate||109-60-4
C6H10O|Cyclohexanon|cyclohexanone||108-94-1
C8H10|Etylbenzen|ethylbenzene||100-41-4
C8H18O|1-Octanol|octan-1-ol n octanol||111-87-5
C6H14O|1-Hexanol|hexan-1-ol n hexanol||111-27-3
C3H8O2|2-Metoxyethanol|2-methoxyethanol methyl cellosolve||109-86-4
C4H10O3|Diethylen glycol|diethylene glycol DEG||111-46-6
C2H3Cl3|1,1,1-Tricloroethan|1 1 1 trichloroethane methyl chloroform||71-55-6
C7H8O|Anisol|anisole methoxybenzene||100-66-3
C7H8O|Benzyl alcohol|benzyl alcohol phenylmethanol||100-51-6
C4H6O3|Anhydrid acetic|acetic anhydride||108-24-7
C8H18O|2-Etyl-1-hexanol|2-ethylhexanol octyl alcohol||104-76-7` }
] as const;

export type LabReagentGroupId = typeof LAB_REAGENT_GROUPS[number]['id'];

export interface LabReagentRow {
  group: LabReagentGroupId;
  formula: string;
  name: string;
  aliases: string;
  species: readonly string[];
  cas: string | null;
  physicalForm: 'solid' | 'liquid';
}

export const LAB_REAGENTS: readonly LabReagentRow[] = LAB_REAGENT_GROUPS.flatMap(group =>
  group.rows.trim().split('\n').map(line => {
    const [formula, name, aliases, species = '', cas = '', form = ''] = line.trim().split('|');
    return { group: group.id, formula, name, aliases, species: species ? species.split(' ') : [], cas: cas || null,
      physicalForm: group.id === 'solvents' || form === 'liquid' ? 'liquid' : 'solid' };
  })
);
