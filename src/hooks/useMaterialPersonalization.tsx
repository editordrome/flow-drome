
import { useState } from 'react';
import { materialTemplates, MaterialTemplate } from '../data/materialTemplates';
import { generatePersonalizedImage } from '../utils/imageGenerator';

interface PersonalizationData {
  nomeUnidade: string;
  telefone: string;
  instagram: string;
  email: string;
}

export const useMaterialPersonalization = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<MaterialTemplate | null>(null);
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData>({
    nomeUnidade: '',
    telefone: '',
    instagram: '',
    email: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'select' | 'edit' | 'preview' | 'editor'>('select');
  const [customTemplates, setCustomTemplates] = useState<MaterialTemplate[]>([]);

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentStep('select');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
    setPersonalizationData({
      nomeUnidade: '',
      telefone: '',
      instagram: '',
      email: '',
    });
    setCurrentStep('select');
  };

  const selectTemplate = (templateId: string) => {
    const template = [...materialTemplates, ...customTemplates].find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCurrentStep('edit');
    }
  };

  const backToSelect = () => {
    setSelectedTemplate(null);
    setCurrentStep('select');
  };

  const updatePersonalizationData = (field: keyof PersonalizationData, value: string) => {
    setPersonalizationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const goToPreview = () => {
    setCurrentStep('preview');
  };

  const goBackToEdit = () => {
    setCurrentStep('edit');
  };

  const goToEditor = () => {
    setCurrentStep('editor');
  };

  const saveCustomTemplate = (template: MaterialTemplate) => {
    const templateWithId = {
      ...template,
      id: `custom-${Date.now()}`,
      name: `${template.name} (Personalizado)`,
      description: 'Material personalizado criado pelo usuário'
    };
    
    setCustomTemplates(prev => [...prev, templateWithId]);
    setSelectedTemplate(templateWithId);
    setCurrentStep('edit');
  };

  const downloadMaterial = async () => {
    if (selectedTemplate) {
      await generatePersonalizedImage('personalized-preview-download', selectedTemplate.name);
    }
  };

  const allTemplates = [...materialTemplates, ...customTemplates];

  return {
    selectedTemplate,
    personalizationData,
    isModalOpen,
    currentStep,
    materialTemplates: allTemplates,
    openModal,
    closeModal,
    selectTemplate,
    backToSelect,
    updatePersonalizationData,
    goToPreview,
    goBackToEdit,
    goToEditor,
    saveCustomTemplate,
    downloadMaterial,
  };
};
