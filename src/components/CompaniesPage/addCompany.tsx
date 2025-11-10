// add company modal with input validation

"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Building2,
  MapPin,
  Briefcase,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { Company } from "@/types/company";
import { cn } from "@/lib/utils";

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  website: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^https?:\/\/|^www\./.test(val), {
      message: "Must be a valid URL",
    }),
  logo_url: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^https?:\/\/|^www\./.test(val), {
      message: "Must be a valid URL",
    }),
  employee_count: z.coerce
    .number()
    .min(1, "Must have at least 1 employee")
    .int()
    .optional(),
  founded: z.coerce
    .number()
    .min(1800, "Founded year must be after 1800")
    .max(new Date().getFullYear(), "Founded year cannot be in the future")
    .optional(),
  address: z.string().optional(),
  city: z.string().min(2, "City is required"),
  zip_code: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  raw_location: z.string().optional(),
  industries: z.array(z.string()).min(1, "At least one industry is required"),
  sectors: z.array(z.string()).optional(),
  ceo_name: z.string().min(2, "CEO name is required"),
  ceo_since: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  ceo_bio: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormDialogProps {
  onAdd: (
    company: Omit<Company, "id" | "created_at">,
  ) => Promise<Company | undefined>;
  mode?: "create" | "edit";
  editCompany?: Company;
}

const STEPS = [
  {
    id: 1,
    title: "Basic Info",
    icon: Building2,
    description: "Company details",
  },
  {
    id: 2,
    title: "Location",
    icon: MapPin,
    description: "Address information",
  },
  {
    id: 3,
    title: "Industry",
    icon: Briefcase,
    description: "Industry & sectors",
  },
  { id: 4, title: "Leadership", icon: User, description: "CEO information" },
];

export function CompanyFormDialog({ onAdd }: CompanyFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      logo_url: "",
      employee_count: undefined,
      founded: new Date().getFullYear(),
      address: "",
      city: "",
      zip_code: "",
      country: "",
      raw_location: "",
      industries: [],
      sectors: [],
      ceo_name: "",
      ceo_since: new Date().getFullYear(),
      ceo_bio: "",
    },
  });

  // getting next step with validation
  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // getting previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // determining fields to validate per step
  const getFieldsForStep = (step: number): (keyof CompanyFormValues)[] => {
    switch (step) {
      case 1:
        return [
          "name",
          "description",
          "website",
          "logo_url",
          "employee_count",
          "founded",
        ];
      case 2:
        return ["address", "city", "zip_code", "country", "raw_location"];
      case 3:
        return ["industries", "sectors"];
      case 4:
        return ["ceo_name", "ceo_since", "ceo_bio"];
      default:
        return [];
    }
  };

  const onSubmit = async (values: CompanyFormValues) => {
    setIsSubmitting(true);

    try {
      const newCompany: Omit<Company, "id" | "created_at"> = {
        name: values.name,
        description: values.description ?? "",
        website: values.website ?? "",
        logo_url: values.logo_url ?? "",
        employee_count: values.employee_count ?? 0,
        founded: values.founded ?? new Date().getFullYear(),
        location: {
          address: values.address,
          city: values.city,
          zip_code: values.zip_code,
          country: values.country,
          raw_location: values.raw_location,
        },
        industry: {
          primary: values.industries[0] ?? "",
          industries: values.industries ?? [],
          sectors: values.sectors ?? [],
        },
        ceo: {
          name: values.ceo_name,
          since: values.ceo_since ?? new Date().getFullYear(),
          bio: values.ceo_bio ?? "",
        },
      };

      await onAdd(newCompany);

      toast.success("Company added successfully!");
      form.reset();
      setCurrentStep(1);
      setOpen?.(false);
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setCurrentStep(1);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button aria-label="add company" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Step {currentStep} of {STEPS.length}:{" "}
            {STEPS[currentStep - 1]!.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6 flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                      isActive &&
                        "border-primary bg-primary text-primary-foreground",
                      isCompleted &&
                        "border-primary bg-primary text-primary-foreground",
                      !isActive &&
                        !isCompleted &&
                        "border-muted bg-background text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium",
                      isActive && "text-foreground",
                      !isActive && "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-[2px] flex-1 transition-all",
                      currentStep > step.id ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto"
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              type="url"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the company..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/logo.png"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="employee_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee Count</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1000"
                              min="1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="founded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Founded Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2020"
                              min="1800"
                              max={new Date().getFullYear()}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="San Francisco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zip_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="94102" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="raw_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raw Location (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Additional location details"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="industries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industries * (comma-separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Technology, Software, Cloud Computing"
                            value={field.value?.join(", ") ?? ""}
                            onChange={(e) => {
                              const industries = e.target.value
                                .split(",")
                                .map((i) => i.trim())
                                .filter(Boolean);
                              field.onChange(industries);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sectors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Industry Sectors (comma-separated)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enterprise Software, SaaS, AI/ML, Cybersecurity"
                            className="resize-none"
                            rows={3}
                            value={field.value?.join(", ") ?? ""}
                            onChange={(e) => {
                              const sectors = e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              field.onChange(sectors);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">
                      <strong>Tip:</strong> Separate multiple industries or
                      sectors with commas. The first industry will be set as the
                      primary industry.
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="ceo_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEO Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ceo_since"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEO Since</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2020"
                              min="1900"
                              max={new Date().getFullYear()}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ceo_bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEO Biography</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief biography of the CEO..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex justify-between gap-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="gap-2 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-3">
                <Button
                  aria-label="cancel adding company"
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    aria-label="submit company"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Company
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
