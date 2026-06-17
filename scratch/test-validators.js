import { createUserSchema, updateUserSchema } from '../server/src/validators/user.validator.js';
import { updateSportSchema } from '../server/src/validators/sport.validator.js';
import { createCoachSchema } from '../server/src/validators/coach.validator.js';
import { createEventSchema } from '../server/src/validators/event.validator.js';
import { updateContactInfoSchema } from '../server/src/validators/contactInfo.validator.js';

console.log('🧪 Starting validation tests...\n');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${message}`);
    failed = true;
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

// ── 1. Test User Creator Zod Validator ──────────────────────────────────
console.log('── 1. User Creation Validator');
const validUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  role: 'editor',
  isActive: true,
};

const resUser = createUserSchema.safeParse(validUser);
assert(resUser.success, 'Valid user object should parse successfully');

const invalidUserPass = { ...validUser, password: '123' };
const resUserPass = createUserSchema.safeParse(invalidUserPass);
assert(!resUserPass.success, 'User password < 8 characters should fail validation');

const invalidUserEmail = { ...validUser, email: 'not-an-email' };
const resUserEmail = createUserSchema.safeParse(invalidUserEmail);
assert(!resUserEmail.success, 'Invalid email format should fail validation');

// ── 2. Test User Update Zod Validator ────────────────────────────────────
console.log('\n── 2. User Update Validator');
const validUpdate = { name: 'Jane Doe', role: 'admin' };
const resUpdate = updateUserSchema.safeParse(validUpdate);
assert(resUpdate.success, 'Valid user update fields should parse successfully');

// ── 3. Test Sport Validator (longDescription required check) ────────────
console.log('\n── 3. Sport Validator');
const validSportUpdate = {
  shortDescription: 'Active Table Tennis coaching.',
  longDescription: 'A very long description containing details...',
};
const resSportUpdate = updateSportSchema.safeParse(validSportUpdate);
assert(resSportUpdate.success, 'Valid sport update should parse successfully');

const invalidSportUpdate = {
  longDescription: '', // empty description should fail min(1) if provided
};
const resSportUpdateFail = updateSportSchema.safeParse(invalidSportUpdate);
assert(!resSportUpdateFail.success, 'Empty longDescription should fail if provided');

// ── 4. Test Coach Validator (bioFull required check) ─────────────────────
console.log('\n── 4. Coach Validator');
const validCoach = {
  name: 'Coach Carter',
  specializations: ['sport_id'],
  yearsOfExperience: 5,
  bioShort: 'A short bio under 160 characters',
  bioFull: 'A detailed biography of the coach.',
  displayOrder: 1,
};
const resCoach = createCoachSchema.safeParse(validCoach);
assert(resCoach.success, 'Valid coach should parse successfully');

const invalidCoachBio = { ...validCoach, bioFull: undefined };
const resCoachBioFail = createCoachSchema.safeParse(invalidCoachBio);
assert(!resCoachBioFail.success, 'Missing bioFull should fail validation');

// ── 5. Test Event Validator (displayOrder required check) ─────────────────
console.log('\n── 5. Event Validator');
const validEvent = {
  title: 'Championship 2026',
  description: 'Detailed description.',
  eventDate: '2026-07-01T10:00:00.000Z',
  displayOrder: 2,
};
const resEvent = createEventSchema.safeParse(validEvent);
assert(resEvent.success, 'Valid event should parse successfully');

const invalidEventOrder = { ...validEvent, displayOrder: undefined };
const resEventOrderFail = createEventSchema.safeParse(invalidEventOrder);
assert(!resEventOrderFail.success, 'Missing displayOrder should fail validation');

// ── 6. Test ContactInfo Validator ───────────────────────────────────────
console.log('\n── 6. ContactInfo Validator');
const validContactUpdate = {
  email: 'new-email@sports.com',
};
const resContactUpdate = updateContactInfoSchema.safeParse(validContactUpdate);
assert(resContactUpdate.success, 'Valid contact update should parse successfully');

const invalidContactUpdate = {
  email: 'not-an-email',
};
const resContactUpdateFail = updateContactInfoSchema.safeParse(invalidContactUpdate);
assert(!resContactUpdateFail.success, 'Invalid email in contact update should fail validation');

if (failed) {
  console.log('\n❌ Some validation tests failed!');
  process.exit(1);
} else {
  console.log('\n🎉 All validation tests passed successfully!');
  process.exit(0);
}
