/**
 * Database Seed Script
 * Seeds the 7 sports, default admin user, and singleton config documents.
 *
 * Usage: npm run seed
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import config from '../config/index.js';
import connectDB from './connect.js';

// ── Models ─────────────────────────────────────────────────────────────────
import User from '../models/User.js';
import Sport from '../models/Sport.js';
import ContactInfo from '../models/ContactInfo.js';
import OperatingHours from '../models/OperatingHours.js';
import SocialLinks from '../models/SocialLinks.js';

// ── Seed Data ──────────────────────────────────────────────────────────────
import { SPORTS_SEED, DAYS_OF_WEEK } from '../utils/constants.js';

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    await connectDB();

    // ── 1. Seed Admin User ─────────────────────────────────────────────────
    const existingAdmin = await User.findOne({ email: config.admin.email });
    if (!existingAdmin) {
      const passwordHash = await User.hashPassword(config.admin.password);
      await User.create({
        name: config.admin.name,
        email: config.admin.email,
        passwordHash,
        role: 'admin',
        isActive: true,
      });
      console.log(`✅ Admin user created: ${config.admin.email}`);
    } else {
      console.log(`⏭️  Admin user already exists: ${config.admin.email}`);
    }

    // ── 2. Seed Sports ─────────────────────────────────────────────────────
    for (const sportData of SPORTS_SEED) {
      const existing = await Sport.findOne({ slug: sportData.slug });
      if (!existing) {
        await Sport.create(sportData);
        console.log(`✅ Sport created: ${sportData.name}`);
      } else {
        console.log(`⏭️  Sport already exists: ${sportData.name}`);
      }
    }

    // ── 3. Seed ContactInfo (singleton) ────────────────────────────────────
    const existingContact = await ContactInfo.findOne();
    if (!existingContact) {
      await ContactInfo.create({
        facilityName: 'Bharti Sports Arena',
        addressLine1: 'Kanwarpura Chouraha, Near Prince Education Hub,Bikaner Agra Bypass Road,Sikar,Rajasthan 332001',
        city: 'Sikar',
        state: 'Rajasthan',
        postalCode: '332001',
        country: 'India',
        latitude: 27.6025,
        longitude:  75.1104468,
        phonePrimary: '+91 9352812625',
        whatsappNumber: +'91 9571794918',
        email: 'bhartisportsarena@gmail.com',
      });
      console.log('✅ ContactInfo seeded');
    } else {
      console.log('⏭️  ContactInfo already exists');
    }

    // ── 4. Seed OperatingHours (singleton) ─────────────────────────────────
    const existingHours = await OperatingHours.findOne();
    if (!existingHours) {
      const schedule = DAYS_OF_WEEK.map((day) => ({
        day,
        isOpen: true,
        openTime: '06:00',
        closeTime: '22:00',
      }));

      await OperatingHours.create({
        schedule,
        timezone: 'Asia/Kolkata',
        specialNotes: 'Fitness Zone closes 30 mins earlier on Sundays.',
      });
      console.log('✅ OperatingHours seeded');
    } else {
      console.log('⏭️  OperatingHours already exists');
    }

    // ── 5. Seed SocialLinks (singleton) ────────────────────────────────────
    const existingSocial = await SocialLinks.findOne();
    if (!existingSocial) {
      await SocialLinks.create({
        instagramUrl: '',
        facebookUrl: '',
        youtubeUrl: '',
        googleBusinessProfileUrl: '',
      });
      console.log('✅ SocialLinks seeded');
    } else {
      console.log('⏭️  SocialLinks already exists');
    }

    console.log('\n🎉 Seed complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
