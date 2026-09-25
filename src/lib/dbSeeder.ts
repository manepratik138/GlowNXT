import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "./firebase";
import { SERVICES, PROFESSIONALS, REVIEWS } from "./data";

export async function seedFirestoreData() {
  const firestore = db;
  if (!firestore) return; // Firebase not configured, skip seeding
  try {
    // Check if services collection is empty
    const servicesCol = collection(firestore, "services");
    const servicesSnapshot = await getDocs(servicesCol);
    
    if (servicesSnapshot.empty) {
      console.log("Seeding services...");
      const batch = writeBatch(firestore);
      SERVICES.forEach((service) => {
        const docRef = doc(firestore, "services", service.id);
        batch.set(docRef, { ...service, active: true });
      });
      await batch.commit();
      console.log("Services seeded successfully.");
    }

    // Check if professionals collection is empty
    const prosCol = collection(firestore, "professionals");
    const prosSnapshot = await getDocs(prosCol);

    if (prosSnapshot.empty) {
      console.log("Seeding professionals...");
      const batch = writeBatch(firestore);
      PROFESSIONALS.forEach((pro) => {
        const docRef = doc(firestore, "professionals", pro.id);
        batch.set(docRef, { ...pro, verificationStatus: "approved", createdAt: new Date().toISOString() });
      });
      await batch.commit();
      console.log("Professionals seeded successfully.");
    }

    // Check if reviews collection is empty
    const reviewsCol = collection(firestore, "reviews");
    const reviewsSnapshot = await getDocs(reviewsCol);

    if (reviewsSnapshot.empty) {
      console.log("Seeding reviews...");
      const batch = writeBatch(firestore);
      REVIEWS.forEach((review) => {
        const docRef = doc(firestore, "reviews", review.id);
        batch.set(docRef, {
          ...review,
          professionalId: review.professionalName === "Ananya Krishnan" ? "p2" :
                          review.professionalName === "Priya Sharma" ? "p1" :
                          review.professionalName === "Meera Patel" ? "p3" :
                          review.professionalName === "Kavitha Nair" ? "p4" :
                          review.professionalName === "Sunita Reddy" ? "p5" : "p6"
        });
      });
      await batch.commit();
      console.log("Reviews seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding Firestore data:", error);
  }
}
