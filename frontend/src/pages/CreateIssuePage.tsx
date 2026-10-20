import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  StepIndicator,
  ImageUploader,
  LocationPicker,
  AIAnalysisStep,
  IdentityStep,
  ReportSuccessModal,
} from "@/components/report";
import { IssueCategory, IssueSeverity, IssueLocation, CivicIssue } from "@/types";
import { useAnalyzeIssue, useCreateIssue } from "@/hooks/useIssues";

export const CreateIssuePage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Navigation State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [location, setLocation] = useState<IssueLocation>({
    address: "",
    locality: "",
    city: "Gurgaon",
    state: "Haryana",
    latitude: 28.5034,
    longitude: 77.0673,
  });

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // AI Analysis State
  const [category, setCategory] = useState<IssueCategory>("Road Infrastructure");
  const [severity, setSeverity] = useState<IssueSeverity>("high");
  const [department, setDepartment] = useState<string>("Roads & Public Works");
  const [aiSummary, setAiSummary] = useState<string>("");
  const [hasTriggeredAi, setHasTriggeredAi] = useState<boolean>(false);

  // Identity & Success State
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [publishedIssue, setPublishedIssue] = useState<CivicIssue | null>(null);

  // Mutations
  const analyzeMutation = useAnalyzeIssue();
  const createIssueMutation = useCreateIssue();

  // Handle Photo selection
  const handleImageSelected = (file: File | null, previewUrl: string | null) => {
    setSelectedFile(file);
    setImagePreview(previewUrl);
    setErrorMessage(null);
  };

  // Step Validation & Forward Navigation
  const handleNext = async () => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!imagePreview) {
        setErrorMessage("Please take a photo or upload an evidence image to proceed.");
        return;
      }
      setCurrentStep(2);
      setMaxStepReached((prev) => Math.max(prev, 2));
    } else if (currentStep === 2) {
      if (!location.locality.trim()) {
        setErrorMessage("Please specify the locality/neighborhood where this issue is located.");
        return;
      }
      setCurrentStep(3);
      setMaxStepReached((prev) => Math.max(prev, 3));
    } else if (currentStep === 3) {
      if (!title.trim()) {
        setErrorMessage("Please enter a short descriptive title for the civic issue.");
        return;
      }

      setCurrentStep(4);
      setMaxStepReached((prev) => Math.max(prev, 4));

      // Trigger AI Analysis on entering step 4 if not done yet
      if (!hasTriggeredAi) {
        setHasTriggeredAi(true);
        analyzeMutation.mutate(
          { title, description, imagePreview: imagePreview || undefined },
          {
            onSuccess: (res) => {
              setCategory(res.category);
              setSeverity(res.severity);
              setDepartment(res.suggestedDepartment);
              setAiSummary(res.summary);
            },
          }
        );
      }
    } else if (currentStep === 4) {
      if (!aiSummary.trim()) {
        setAiSummary(`AI Summary: ${title} reported at ${location.locality}. Requires ${department} inspection.`);
      }
      setCurrentStep(5);
      setMaxStepReached((prev) => Math.max(prev, 5));
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  // Publish Civic Issue
  const handlePublish = async () => {
    setErrorMessage(null);
    try {
      const issue = await createIssueMutation.mutateAsync({
        title,
        description,
        image: selectedFile || imagePreview || "",
        imageUrl: imagePreview || undefined,
        category,
        severity,
        department,
        location,
        isAnonymous,
        aiSummary,
      });

      setPublishedIssue(issue);
    } catch {
      setErrorMessage("Failed to publish issue. Please check your connection and try again.");
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStep === 1 ? "Cancel" : "Back"}
        </button>

        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          Citizen Reporting Portal
        </span>
      </div>

      {/* Progress Step Indicator */}
      <div className="pt-1">
        <StepIndicator
          currentStep={currentStep}
          maxStepReached={maxStepReached}
          onStepClick={(step) => setCurrentStep(step)}
        />
      </div>

      {/* Error Alert if validation fails */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200 animate-shake">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Step Content Container */}
      <Card className="border-slate-200/90 shadow-card overflow-hidden bg-white">
        <CardContent className="p-5 sm:p-7 space-y-5">
          {/* STEP 1: PHOTO / EVIDENCE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
                  What needs attention?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Take a photo or upload evidence of the real-world civic problem.
                </p>
              </div>

              <ImageUploader
                imagePreview={imagePreview}
                onImageSelected={handleImageSelected}
              />
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
                  Where is this issue located?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Detect your current GPS coordinates or enter the neighborhood.
                </p>
              </div>

              <LocationPicker
                location={location}
                onLocationChange={setLocation}
              />
            </div>
          )}

          {/* STEP 3: DESCRIBE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
                  Describe the issue
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  A concise title helps mobilize community support and municipal response.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="issue-title" className="text-xs font-bold text-slate-800">
                    Issue Title *
                  </label>
                  <input
                    id="issue-title"
                    type="text"
                    required
                    placeholder="e.g. Dangerous pothole near DAV School crossing"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="issue-desc" className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Additional Description</span>
                    <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                  </label>
                  <textarea
                    id="issue-desc"
                    rows={4}
                    placeholder="Tell us anything the photo doesn't show (e.g. how long it's been damaged, accidents caused)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AI ANALYSIS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
                  AI Issue Triage & Routing
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Groq AI analyzed your evidence. You can adjust the predictions below.
                </p>
              </div>

              <AIAnalysisStep
                isAnalyzing={analyzeMutation.isPending}
                aiResult={analyzeMutation.data || null}
                category={category}
                onCategoryChange={setCategory}
                severity={severity}
                onSeverityChange={setSeverity}
                department={department}
                onDepartmentChange={setDepartment}
                aiSummary={aiSummary}
                onSummaryChange={setAiSummary}
              />
            </div>
          )}

          {/* STEP 5: REVIEW & PUBLISH */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
                  Choose Identity & Publish
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Decide how you want your civic report to be publicly attributed.
                </p>
              </div>

              <IdentityStep
                isAnonymous={isAnonymous}
                onAnonymousChange={setIsAnonymous}
                title={title}
                category={category}
                severity={severity}
                department={department}
                location={location}
                imagePreview={imagePreview}
                aiSummary={aiSummary}
              />
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={handleBack}
                className="text-xs font-semibold"
              >
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <Button
                type="button"
                variant="civic"
                size="default"
                onClick={handleNext}
                className="font-bold shadow-xs px-6"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {currentStep === 3 ? "Run AI Analysis" : "Continue"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="civic"
                size="lg"
                onClick={handlePublish}
                isLoading={createIssueMutation.isPending}
                className="font-bold shadow-md shadow-emerald-600/30 px-8 text-sm sm:text-base"
                rightIcon={<Send className="h-4 w-4" />}
              >
                Publish Civic Issue
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Modal upon publishing */}
      {publishedIssue && (
        <ReportSuccessModal
          issue={publishedIssue}
          onViewIssue={() => navigate(`/issues/${publishedIssue.id}`)}
          onGoHome={() => navigate("/")}
        />
      )}
    </div>
  );
};
