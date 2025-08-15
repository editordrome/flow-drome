
export interface FieldPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface FieldStyle {
  fontFamily: string;
  fontSize: string;
  color: string;
  fontWeight: string;
  textShadow?: string;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
}

export interface FieldConfig {
  position: FieldPosition;
  style: FieldStyle;
  placeholder: string;
  emoji?: string;
}

export interface MaterialTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  fields: {
    nomeUnidade: FieldConfig;
    telefone: FieldConfig;
    instagram: FieldConfig;
    email: FieldConfig;
  };
}

export const materialTemplates: MaterialTemplate[] = [
  {
    id: "folheto-a5-limpeza",
    name: "Folheto A5 - Maria Brasileira",
    description: "Material promocional para limpeza residencial",
    imageUrl: "/lovable-uploads/6880aa78-86b1-4f80-8d2e-66e671b60680.png",
    fields: {
      nomeUnidade: {
        position: {
          top: '76%',
          left: '7%',
          textAlign: 'left'
        },
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          color: '#1d7447',
          fontWeight: 'bold'
        },
        placeholder: 'Nome da Unidade'
      },
      telefone: {
        position: {
          top: '83.5%',
          left: '12%',
          textAlign: 'left'
        },
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          color: '#1d7447',
          fontWeight: '600'
        },
        placeholder: '(00) 99999-9999'
      },
      instagram: {
        position: {
          top: '86.5%',
          left: '12%',
          textAlign: 'left'
        },
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          color: '#1d7447',
          fontWeight: '600'
        },
        placeholder: '@instagram.unidade'
      },
      email: {
        position: {
          top: '91%',
          left: '7%',
          textAlign: 'left'
        },
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          color: '#1d7447',
          fontWeight: '600'
        },
        placeholder: 'email@unidade.com.br'
      }
    }
  }
];
