/**
 * A dialog component for editing company information.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Company} props.company - The company object containing the current company data
 * @param {boolean} props.open - Controls the visibility of the dialog
 * @param {(open: boolean) => void} props.onOpenChange - Callback function when dialog open state changes
 * @param {(id: string, data: EditCompanyFormValues) => Promise<void>} props.onUpdate - Callback function to handle company update
 *
 * @example
 * ```tsx
 * <EditCompanyDialog
 *   company={companyData}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onUpdate={handleUpdateCompany}
 * />
 * ```
 */
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@/types/company";

const editCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
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
});

type EditCompanyFormValues = z.infer<typeof editCompanySchema>;

interface EditCompanyDialogProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Company>) => Promise<void>;
}

export function EditCompanyDialog({
  company,
  open,
  onOpenChange,
  onUpdate,
}: EditCompanyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditCompanyFormValues>({
    resolver: zodResolver(editCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      logo_url: "",
      employee_count: undefined,
      founded: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        description: company.description ?? "",
        website: company.website ?? "",
        logo_url: company.logo_url ?? "",
        employee_count: company.employee_count,
        founded: company.founded,
      });
    }
  }, [company, form]);

  const onSubmit = async (values: EditCompanyFormValues) => {
    if (!company) return;

    // only changing these values for demo purposes.
    setIsSubmitting(true);
    try {
      await onUpdate(company.id, {
        name: values.name,
        description: values.description || "",
        website: values.website || "",
        logo_url: values.logo_url || "",
        employee_count: values.employee_count || 0,
        founded: values.founded || new Date().getFullYear(),
      });
      toast.success("Company updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update company. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update the basic information for {company?.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Company
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
