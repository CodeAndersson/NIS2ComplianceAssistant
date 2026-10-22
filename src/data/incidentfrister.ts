// Rapporteringsfrister vid betydande incidenter (3 kap. cybersäkerhetslagen)

export interface Incidentfrist {
  tid: string;
  titel: string;
  text: string;
}

export const INCIDENT_FRISTER: readonly Incidentfrist[] = [
  { tid: '24 h',  titel: 'Tidig varning',     text: 'Initial notifiering till MCF vid misstanke om betydande incident.' },
  { tid: '72 h',  titel: 'Incidentanmälan',   text: 'Detaljerad rapport: omfattning, troliga orsaker och vidtagna åtgärder.' },
  { tid: '1 mån', titel: 'Slutrapport',       text: 'Slutgiltig analys: rotorsak och långsiktiga förbättringar.' }
];
