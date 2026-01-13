// src/components/ProductCreate/utils/aiHelpers.ts

type AiLoadingSetter = React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

export const generateWithAI = async (
  field: string,
  context: string,
  setAiLoading: AiLoadingSetter,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  setAiLoading((prev: any) => ({ ...prev, [field]: true }));
  try {
    const res = await fetch(
      `${import.meta.env.VITE_PUBLIC_API_URL}/products/generate-field`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, context }),
      }
    );
    const data = await res.json();
    if (!data.success) throw new Error();
    setFormData((prev: any) => ({ ...prev, [field]: data.data }));
  } catch (err) {
    alert('AI generation failed');
  } finally {
    setAiLoading((prev: any) => ({ ...prev, [field]: false }));
  }
};

export const generateSpecifications = async (
  formData: any,
  selectedCategoryId: string,
  categories: any[],
  specificationKeys: string[],
  setAiLoading: AiLoadingSetter,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  setAiLoading((prev: any) => ({ ...prev, specifications: true }));
  try {
    const category = categories.find((cat: any) => cat._id === selectedCategoryId);
    const context = `
Product: ${formData.productName}
Category: ${category?.name}
Brand: ${formData.brand}
`;
    const res = await fetch(
      `${import.meta.env.VITE_PUBLIC_API_URL}/products/generate-specifications`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, specificationKeys }),
      }
    );
    const data = await res.json();
    if (!data.success) throw new Error();
    setFormData((prev: any) => ({
      ...prev,
      specifications: [data.data],
    }));
  } catch (err) {
    alert('Specification generation failed');
  } finally {
    setAiLoading((prev: any) => ({ ...prev, specifications: false }));
  }
};