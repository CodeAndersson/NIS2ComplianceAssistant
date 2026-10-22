// Sektorer enligt bilaga 1 och 2 till NIS2-direktivet samt behöriga tillsynsmyndigheter

export const SEKTORER_BILAGA_1 = [
  'Energi', 'Transport', 'Bank- och finansmarknad', 'Hälso- och sjukvård',
  'Dricksvatten', 'Avloppsvatten', 'Digital infrastruktur',
  'IKT-tjänsteförvaltning (B2B)', 'Offentlig förvaltning', 'Rymd'
];

export const SEKTORER_BILAGA_2 = [
  'Post- och budtjänster', 'Avfallshantering',
  'Tillverkning, produktion och distribution av kemikalier',
  'Produktion, bearbetning och distribution av livsmedel',
  'Tillverkning', 'Digitala leverantörer', 'Forskning'
];

// Mappning sektor → behörig sektorsmyndighet enligt cybersäkerhetsförordningen (2025:1507)
// MCF har samordnande roll; sektorsmyndigheter utövar faktisk tillsyn
export const SEKTOR_MYNDIGHET = {
  'Energi':                                                  { myndighet: 'Energimyndigheten',         webb: 'energimyndigheten.se' },
  'Transport':                                               { myndighet: 'Transportstyrelsen',        webb: 'transportstyrelsen.se' },
  'Bank- och finansmarknad':                                 { myndighet: 'Finansinspektionen',        webb: 'fi.se' },
  'Hälso- och sjukvård':                                     { myndighet: 'Inspektionen för vård och omsorg (IVO)', webb: 'ivo.se' },
  'Dricksvatten':                                            { myndighet: 'Livsmedelsverket',          webb: 'livsmedelsverket.se' },
  'Avloppsvatten':                                           { myndighet: 'Naturvårdsverket',          webb: 'naturvardsverket.se' },
  'Digital infrastruktur':                                   { myndighet: 'Post- och telestyrelsen (PTS)', webb: 'pts.se' },
  'IKT-tjänsteförvaltning (B2B)':                            { myndighet: 'Post- och telestyrelsen (PTS)', webb: 'pts.se' },
  'Offentlig förvaltning':                                   { myndighet: 'Myndigheten för civilt försvar (MCF)', webb: 'mcf.se' },
  'Rymd':                                                    { myndighet: 'Myndigheten för civilt försvar (MCF)', webb: 'mcf.se' },
  'Post- och budtjänster':                                   { myndighet: 'Post- och telestyrelsen (PTS)', webb: 'pts.se' },
  'Avfallshantering':                                        { myndighet: 'Naturvårdsverket',          webb: 'naturvardsverket.se' },
  'Tillverkning, produktion och distribution av kemikalier': { myndighet: 'Kemikalieinspektionen',     webb: 'kemi.se' },
  'Produktion, bearbetning och distribution av livsmedel':   { myndighet: 'Livsmedelsverket',          webb: 'livsmedelsverket.se' },
  'Tillverkning':                                            { myndighet: 'Myndigheten för civilt försvar (MCF)', webb: 'mcf.se' },
  'Digitala leverantörer':                                   { myndighet: 'Post- och telestyrelsen (PTS)', webb: 'pts.se' },
  'Forskning':                                               { myndighet: 'Myndigheten för civilt försvar (MCF)', webb: 'mcf.se' }
};
