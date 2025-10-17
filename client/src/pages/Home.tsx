import React, { useState } from "react";
import { useLocation } from "wouter";
import { FileText, LogOut, Loader2, Calendar } from "lucide-react";
import { getCurrentUser, logout } from "@/utils/auth";
import { ResumeUpload } from "@/components/ResumeUpload";
import { Alert } from "@/components/Alert";
import {
  offerLetterSchema,
  type OfferLetterData,
  type WebhookPayload,
} from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const currentUser = getCurrentUser();
  const [pdfUrl, setPdfUrl] = useState("");
  const [showActions, setShowActions] = useState(false);

  const [formData, setFormData] = useState({
    candidateName: "",
    designation: "",
    reportingManager: "",
    timings: "",
    department: "",
    probationPeriod: "",
    roleResponsibilities: "",
    ctc: "",
    salarySheet: "",
    dateOfOffer: "",
    studentSignature: "",
    resumeBase64: "",
    resumeFileName: "",
    resumeFileSize: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleResumeUpload = (
    base64: string,
    fileName: string,
    fileSize: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      resumeBase64: base64,
      resumeFileName: fileName,
      resumeFileSize: fileSize,
    }));
    if (errors.resumeBase64) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.resumeBase64;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = offerLetterSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);

      const firstError = document.querySelector('[aria-invalid="true"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });

      return;
    }

    setIsSubmitting(true);

    try {
      const payload: WebhookPayload = {
        resume_base64: formData.resumeBase64,
        fields: {
          candidate_name: formData.candidateName,
          designation: formData.designation,
          reporting_manager: formData.reportingManager,
          timings: formData.timings,
          department: formData.department,
          probation_period: formData.probationPeriod,
          role_responsibilities: formData.roleResponsibilities,
          ctc: formData.ctc,
          salary_sheet: formData.salarySheet,
          date_of_offer_letter: formData.dateOfOffer,
          student_signature: formData.studentSignature,
        },
      };

      const response = await fetch("/api/submit-offer-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.pdf_url) {
          setPdfUrl(data.pdf_url);
          setShowActions(true);
        }
        setAlert({
          type: "success",
          message: "Offer letter submitted successfully!",
        });

        setFormData({
          candidateName: "",
          designation: "",
          reportingManager: "",
          timings: "",
          department: "",
          probationPeriod: "",
          roleResponsibilities: "",
          ctc: "",
          salarySheet: "",
          dateOfOffer: "",
          studentSignature: "",
          resumeBase64: "",
          resumeFileName: "",
          resumeFileSize: 0,
        });
      } else {
        throw new Error("Failed to submit offer letter");
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to submit offer letter. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border bg-background shadow-sm sticky top-0 z-40">
        <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              Offer Letter Automation
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span
              className="text-sm text-muted-foreground"
              data-testid="text-username"
            >
              {currentUser}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground border-2 border-border rounded-lg hover-elevate active-elevate-2 transition-all duration-150"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-foreground mb-2">
            Create Offer Letter
          </h2>
          <p className="text-base text-muted-foreground">
            Upload candidate resume and fill in the details to generate an offer
            letter
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 md:p-8 border border-card-border sticky top-24">
                <ResumeUpload
                  onFileUpload={handleResumeUpload}
                  error={errors.resumeBase64}
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-xl p-6 md:p-8 border border-card-border">
                <h3 className="text-lg font-medium text-foreground mb-6">
                  Personal Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="candidateName"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Candidate Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="candidateName"
                      type="text"
                      value={formData.candidateName}
                      onChange={(e) =>
                        handleInputChange("candidateName", e.target.value)
                      }
                      className={`
                        w-full h-12 px-4 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.candidateName
                            ? "border-destructive"
                            : "border-input"
                        }
                      `}
                      placeholder="Enter candidate's full name"
                      aria-invalid={!!errors.candidateName}
                      data-testid="input-candidate-name"
                    />
                    {errors.candidateName && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.candidateName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="studentSignature"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Student Signature{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="studentSignature"
                      type="text"
                      value={formData.studentSignature}
                      onChange={(e) =>
                        handleInputChange("studentSignature", e.target.value)
                      }
                      className={`
                        w-full h-12 px-4 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.studentSignature
                            ? "border-destructive"
                            : "border-input"
                        }
                      `}
                      placeholder="Enter signature name"
                      style={{ borderBottomStyle: "dotted" }}
                      aria-invalid={!!errors.studentSignature}
                      data-testid="input-student-signature"
                    />
                    {errors.studentSignature && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.studentSignature}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      This will appear as the candidate's signature
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 md:p-8 border border-card-border">
                <h3 className="text-lg font-medium text-foreground mb-6">
                  Job Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="designation"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Designation <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="designation"
                      type="text"
                      value={formData.designation}
                      onChange={(e) =>
                        handleInputChange("designation", e.target.value)
                      }
                      className={`
                        w-full h-12 px-4 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.designation
                            ? "border-destructive"
                            : "border-input"
                        }
                      `}
                      placeholder="e.g., Software Engineer"
                      aria-invalid={!!errors.designation}
                      data-testid="input-designation"
                    />
                    {errors.designation && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.designation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Department <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="department"
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      className={`
                        w-full h-12 px-4 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.department
                            ? "border-destructive"
                            : "border-input"
                        }
                      `}
                      placeholder="e.g., Engineering"
                      aria-invalid={!!errors.department}
                      data-testid="input-department"
                    />
                    {errors.department && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reportingManager"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Reporting Manager{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="reportingManager"
                      type="text"
                      value={formData.reportingManager}
                      onChange={(e) =>
                        handleInputChange("reportingManager", e.target.value)
                      }
                      className={`
                        w-full h-12 px-4 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.reportingManager
                            ? "border-destructive"
                            : "border-input"
                        }
                      `}
                      placeholder="Enter manager's name"
                      aria-invalid={!!errors.reportingManager}
                      data-testid="input-reporting-manager"
                    />
                    {errors.reportingManager && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.reportingManager}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="timings"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Timings (Working Hours){" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="timings"
                      type="text"
                      value={formData.timings}
                      onChange={(e) =>
                        handleInputChange("timings", e.target.value)
                      }
                      className={`
                        w-full h-12 px-4 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.timings ? "border-destructive" : "border-input"
                        }
                      `}
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                      aria-invalid={!!errors.timings}
                      data-testid="input-timings"
                    />
                    {errors.timings && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.timings}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="probationPeriod"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Probation Period{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="probationPeriod"
                      type="text"
                      value={formData.probationPeriod}
                      onChange={(e) =>
                        handleInputChange("probationPeriod", e.target.value)
                      }
                      className={`
                        w-full h-12 px-4 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.probationPeriod
                            ? "border-destructive"
                            : "border-input"
                        }
                      `}
                      placeholder="e.g., 3 months"
                      aria-invalid={!!errors.probationPeriod}
                      data-testid="input-probation-period"
                    />
                    {errors.probationPeriod && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.probationPeriod}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="roleResponsibilities"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Core Role & Responsibilities{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="roleResponsibilities"
                      value={formData.roleResponsibilities}
                      onChange={(e) =>
                        handleInputChange(
                          "roleResponsibilities",
                          e.target.value
                        )
                      }
                      rows={6}
                      className={`
                        w-full px-4 py-3 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200 resize-vertical min-h-32
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.roleResponsibilities
                            ? "border-destructive"
                            : "border-input"
                        }
                      `}
                      placeholder="Describe the key responsibilities and expectations for this role..."
                      aria-invalid={!!errors.roleResponsibilities}
                      data-testid="textarea-role-responsibilities"
                    />
                    {errors.roleResponsibilities && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.roleResponsibilities}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 md:p-8 border border-card-border">
                <h3 className="text-lg font-medium text-foreground mb-6">
                  Compensation
                </h3>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="ctc"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Compensation (CTC){" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="ctc"
                      type="text"
                      value={formData.ctc}
                      onChange={(e) => handleInputChange("ctc", e.target.value)}
                      className={`
                        w-full h-12 px-4 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${errors.ctc ? "border-destructive" : "border-input"}
                      `}
                      placeholder="e.g., $80,000 per annum"
                      aria-invalid={!!errors.ctc}
                      data-testid="input-ctc"
                    />
                    {errors.ctc && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.ctc}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="salarySheet"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Salary Sheet <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="salarySheet"
                      value={formData.salarySheet}
                      onChange={(e) =>
                        handleInputChange("salarySheet", e.target.value)
                      }
                      rows={4}
                      className={`
                        w-full px-4 py-3 rounded-lg border-2 bg-background
                        text-foreground placeholder:text-muted-foreground
                        transition-all duration-200 resize-vertical min-h-32
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.salarySheet
                            ? "border-destructive"
                            : "border-input"
                        }
                      `}
                      placeholder="Provide detailed salary breakdown (base, bonuses, benefits, etc.)"
                      aria-invalid={!!errors.salarySheet}
                      data-testid="textarea-salary-sheet"
                    />
                    {errors.salarySheet && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.salarySheet}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 md:p-8 border border-card-border">
                <h3 className="text-lg font-medium text-foreground mb-6">
                  Additional Information
                </h3>
                <div>
                  <label
                    htmlFor="dateOfOffer"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Date of Offer Letter{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="dateOfOffer"
                      type="date"
                      value={formData.dateOfOffer}
                      onChange={(e) =>
                        handleInputChange("dateOfOffer", e.target.value)
                      }
                      className={`
                        w-full h-12 px-4 rounded-lg border-2 bg-background
                        text-foreground
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          errors.dateOfOffer
                            ? "border-destructive"
                            : "border-input"
                        }
                      `}
                      aria-invalid={!!errors.dateOfOffer}
                      data-testid="input-date-of-offer"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors.dateOfOffer && (
                    <p className="text-sm text-destructive mt-1" role="alert">
                      {errors.dateOfOffer}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none sm:min-w-48 h-12 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg transition-all duration-150 hover-elevate active-elevate-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="button-submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Offer Letter"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      candidateName: "",
                      designation: "",
                      reportingManager: "",
                      timings: "",
                      department: "",
                      probationPeriod: "",
                      roleResponsibilities: "",
                      ctc: "",
                      salarySheet: "",
                      dateOfOffer: "",
                      studentSignature: "",
                      resumeBase64: "",
                      resumeFileName: "",
                      resumeFileSize: 0,
                    });
                    setErrors({});
                  }}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none sm:min-w-48 h-12 px-8 py-3 border-2 border-border text-foreground font-medium rounded-lg transition-all duration-150 hover-elevate active-elevate-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  data-testid="button-reset"
                >
                  Reset Form
                </button>
              </div>
            </div>
          </div>
        </form>
        {showActions && (
          <div>
            <button
              className="flex-1 sm:flex-none sm:min-w-48 h-12 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg transition-all duration-150 hover-elevate active-elevate-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={() => {
                const a = document.createElement("a");
                a.href = pdfUrl;
                a.download = "OfferLetter.pdf";
                a.click();
              }}
            >
              Download PDF
            </button>
          </div>
        )}
      </main>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
