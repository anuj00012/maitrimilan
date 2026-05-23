import { Button, Card, Field, Section } from "@/components/ui";
import { saveProfile } from "./actions";

export default function OnboardingPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black text-ink">Complete your profile</h1>
        <p className="mt-2 text-stone-600">Your profile becomes visible only after admin verification.</p>
        {searchParams.message ? (
          <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{searchParams.message}</p>
        ) : null}
        <Card className="mt-6 p-6">
          <form action={saveProfile} className="grid gap-6" encType="multipart/form-data">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" name="fullName" required />
              <div className="grid gap-2">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" required>
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Field label="Date of birth" name="dateOfBirth" type="date" required />
              <Field label="Religion" name="religion" />
              <Field label="Community" name="community" />
              <Field label="Caste (optional)" name="caste" />
              <Field label="Education" name="education" required />
              <Field label="Profession" name="profession" required />
              <Field label="Income range (optional)" name="incomeRange" />
              <Field label="City" name="city" required />
              <Field label="State" name="state" required />
              <Field label="Height" name="height" placeholder="5 ft 7 in" required />
              <div className="grid gap-2">
                <label htmlFor="maritalStatus">Marital status</label>
                <select id="maritalStatus" name="maritalStatus" required>
                  <option value="">Select</option>
                  <option value="never_married">Never married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="aboutMe">About me</label>
              <textarea id="aboutMe" name="aboutMe" rows={5} required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="partnerPreferences">Partner preferences</label>
              <textarea id="partnerPreferences" name="partnerPreferences" rows={5} required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="photos">Photos</label>
                <input id="photos" name="photos" type="file" accept="image/*" multiple />
              </div>
              <div className="grid gap-2">
                <label htmlFor="idProof">ID proof for verification</label>
                <input id="idProof" name="idProof" type="file" accept="image/*,.pdf" required />
                <p className="text-xs text-stone-500">Private. Admin-only access.</p>
              </div>
            </div>
            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input className="mt-1 h-4 w-4" type="checkbox" name="privacyAccepted" required />
              I agree that MaitriMilan may review my submitted details for verification.
            </label>
            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input className="mt-1 h-4 w-4" type="checkbox" name="termsAccepted" required />
              I accept the terms of use and respectful communication policy.
            </label>
            <Button type="submit">Submit for verification</Button>
          </form>
        </Card>
      </div>
    </Section>
  );
}
