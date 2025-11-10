/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrayField } from '../components/form/ArrayField';
import { initialData as importedInitialData, type TemplateData } from '../data';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_URL } from '@/store/slices/vendor/productSlice';

const selectVendorId = (state: any): string | undefined =>
  state?.auth?.user?.id;

// ✅ Create a safe, full fallback structure to prevent undefined access
const safeInitialData: TemplateData = {
  components: {
    social_page: {
      facebook: '',
      instagram: '',
      whatsapp: '',
      twitter: '',
      faqs: {
        heading: '',
        subheading: '',
        faqs: [],
      },
    },
    logo: '',
    home_page: {
      header_text: '',
      backgroundImage: '',
      header_text_small: '',
      button_header: '',
      description: {
        large_text: '',
        summary: '',
        percent: {
          percent_in_number: '',
          percent_text: ''
        },
        sold: {
          sold_number: '',
          sold_text: ''
        }
      }
    },
    about_page: {
      hero: {
        backgroundImage: '',
        title: '',
        subtitle: ''
      },
      story: {
        heading: '',
        paragraphs: [],
        image: ''
      },
      values: [],
      team: [],
      stats: []
    },
    contact_page: {
      section_2: undefined,
      hero: {
        backgroundImage: '',
        title: '',
        subtitle: ''
      },
      contactInfo: [],
      contactForm: {
        heading: '',
        description: '',
        fields: [],
        submitButtonText: ''
      },
      visitInfo: {
        heading: '',
        description: '',
        mapImage: '',
        reasonsHeading: '',
        reasonsList: []
      },
      faqSection: {
        heading: '',
        subheading: '',
        faqs: []
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        whatsapp: '',
        twitter: ''
      }
    }
  },

};

// ✅ Merge user-defined initialData (if partial)
const initialData: TemplateData = {
  ...safeInitialData,
  ...importedInitialData,
  components: {
    ...safeInitialData.components,
    ...importedInitialData?.components,
    social_page: {
      ...safeInitialData.components.social_page,
      ...importedInitialData?.components?.social_page,
      faqs: {
        ...safeInitialData.components.social_page.faqs,
        ...importedInitialData?.components?.social_page?.faqs,
        faqs:
          importedInitialData?.components?.social_page?.faqs?.faqs ??
          safeInitialData.components.social_page.faqs.faqs,
      },
    },
  },
};

function VendorTemplateOther() {
  const vendor_id = useSelector(selectVendorId);
  const [data, setData] = useState<TemplateData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  /** Deep update helper */
  const updateField = (path: string[], value: unknown) => {
    setData((prev) => {
      const clone: any = structuredClone(prev);
      let current: any = clone;
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return clone;
    });
  };

  /** Save Handler */
  const handleSave = async () => {
    if (!vendor_id) {
      toast.error('Vendor ID is missing. Please log in again.');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        vendor_id,
        social_page: data.components.social_page,
      };

      const response = await axios.put(`${BASE_URL}/templates/social-faqs`, payload);

      if (response.data?.success) {
        toast.success(response.data?.message || 'Saved successfully!');
      } else {
        toast.error(response.data?.message || 'Failed to save.');
      }
    } catch (error: unknown) {
      console.error('Save error:', error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'An error occurred while saving.'
        );
      } else {
        toast.error('Unexpected error occurred.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  /** Social Platforms */
  const socialPlatforms: {
    key: keyof TemplateData['components']['social_page'];
    label: string;
  }[] = [
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'whatsapp', label: 'WhatsApp Number or Link' },
    { key: 'twitter', label: 'Twitter/X URL' },
  ];

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="p-6">
        <div className="space-y-6">
          {/* === FAQ Section === */}
          <div className="space-y-2">
            <Label>FAQ Heading</Label>
            <Input
              value={data?.components?.social_page?.faqs?.heading ?? ''}
              onChange={(e) =>
                updateField(['components', 'social_page', 'faqs', 'heading'], e.target.value)
              }
              placeholder="Enter FAQ heading"
            />

            <Label>FAQ Subheading</Label>
            <Input
              value={data?.components?.social_page?.faqs?.subheading ?? ''}
              onChange={(e) =>
                updateField(['components', 'social_page', 'faqs', 'subheading'], e.target.value)
              }
              placeholder="Enter FAQ subheading"
            />

            <ArrayField
              label="FAQs"
              items={data?.components?.social_page?.faqs?.faqs ?? []}
              onAdd={() => {
                const list = [...(data?.components?.social_page?.faqs?.faqs ?? [])];
                list.push({ question: '', answer: '' });
                updateField(['components', 'social_page', 'faqs', 'faqs'], list);
              }}
              onRemove={(i) => {
                const list = [...(data?.components?.social_page?.faqs?.faqs ?? [])];
                list.splice(i, 1);
                updateField(['components', 'social_page', 'faqs', 'faqs'], list);
              }}
              renderItem={(item: { question: string; answer: string }, idx: number) => (
                <div key={idx} className="space-y-2">
                  <Input
                    placeholder="Question"
                    value={item.question}
                    onChange={(e) => {
                      const list = [...(data?.components?.social_page?.faqs?.faqs ?? [])];
                      list[idx] = { ...list[idx], question: e.target.value };
                      updateField(['components', 'social_page', 'faqs', 'faqs'], list);
                    }}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={item.answer}
                    onChange={(e) => {
                      const list = [...(data?.components?.social_page?.faqs?.faqs ?? [])];
                      list[idx] = { ...list[idx], answer: e.target.value };
                      updateField(['components', 'social_page', 'faqs', 'faqs'], list);
                    }}
                  />
                </div>
              )}
            />
          </div>

          {/* === Social Media Section === */}
          <div className="space-y-4 pt-6 border-t">
            <h2 className="text-lg font-semibold">Social Media Links</h2>
            {socialPlatforms.map((platform:any) => (
              <div key={platform.key} className="space-y-1">
                <Label htmlFor={`social-${platform.key}`}>{platform.label}</Label>
                <Input
                  id={`social-${platform.key}`}
                  value={(data?.components?.social_page?.[platform.key] as string) ?? ''}
                  onChange={(e) =>
                    updateField(['components', 'social_page', platform.key], e.target.value)
                  }
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>

          {/* === Save Button === */}
          <div className="pt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving || !vendor_id}
              className="min-w-[120px]"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default VendorTemplateOther;
