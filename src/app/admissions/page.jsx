import { AdmissionForm } from "./components/admission-form";

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-2xl space-y-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Apply for Admission
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in your child&apos;s details below and our admissions team will get in touch
            with you shortly.
          </p>
        </div>

        <AdmissionForm />
      </div>
    </div>
  );
}
