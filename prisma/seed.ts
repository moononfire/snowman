import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const sql = neon(process.env.DATABASE_URL!);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter: new PrismaNeon(sql as any) } as any);

async function main() {
  const contacts = await prisma.$transaction([
    prisma.contact.create({ data: { firstName: "Marek", lastName: "Kowalski", phone: "+48 501 234 567", company: "Kowalski & Syn Sp. z o.o.", position: "Prezes", email: "m.kowalski@kowalski.pl", preCallNote: "Firma budowlana, 50 pracowników. Rozmawiał z nami rok temu, był zainteresowany.", tags: "B2B, budowlanka, ciepły" } }),
    prisma.contact.create({ data: { firstName: "Anna", lastName: "Nowak", phone: "+48 512 345 678", company: "Nowak Consulting", position: "CEO", email: "anna@nowakconsulting.pl", preCallNote: "Freelancerka, szuka narzędzi do zarządzania klientami.", tags: "B2B, consulting" } }),
    prisma.contact.create({ data: { firstName: "Piotr", lastName: "Wiśniewski", phone: "+48 693 456 789", company: "TechStart Sp. z o.o.", position: "CTO", email: "p.wisniewski@techstart.io", preCallNote: "Startup technologiczny, seria A. Piotr decyduje o zakupach IT.", tags: "B2B, tech, startup" } }),
    prisma.contact.create({ data: { firstName: "Katarzyna", lastName: "Wójcik", phone: "+48 604 567 890", company: "Sklep Ogrodniczy Zielony Raj", position: "Właściciel", email: "k.wojcik@zielonyraj.pl", preCallNote: "Mały sklep stacjonarny, chce przejść online.", tags: "SMB, ecommerce" } }),
    prisma.contact.create({ data: { firstName: "Tomasz", lastName: "Zając", phone: "+48 725 678 901", company: "Agencja Reklamowa Efekt", position: "Dyrektor Sprzedaży", email: "t.zajac@agencjaefekt.pl", tags: "B2B, marketing" } }),
    prisma.contact.create({ data: { firstName: "Monika", lastName: "Lewandowska", phone: "+48 888 789 012", company: "Gabinet Stomatologiczny Dr Lewandowska", position: "Właściciel", email: "monika@drlewandowska.pl", preCallNote: "Prywatny gabinet, 2 fotele. Szuka systemu do umawiania wizyt.", tags: "medycyna, SMB" } }),
    prisma.contact.create({ data: { firstName: "Krzysztof", lastName: "Dąbrowski", phone: "+48 501 890 123", company: "Dąbrowski Transport", position: "Dyrektor", email: "k.dabrowski@dabrowski-transport.pl", preCallNote: "Firma transportowa, 15 tirów. Zainteresowany optymalizacją tras.", tags: "transport, B2B" } }),
    prisma.contact.create({ data: { firstName: "Joanna", lastName: "Kamińska", phone: "+48 512 901 234", company: "Salon Beauty Queen", position: "Właściciel", email: "joanna@beautyqueen.pl", tags: "beauty, SMB, B2C" } }),
    prisma.contact.create({ data: { firstName: "Rafał", lastName: "Szymański", phone: "+48 693 012 345", company: "Szymański Deweloper", position: "Prezes", email: "r.szymanski@szymanski-dev.pl", preCallNote: "Deweloper mieszkaniowy, buduje 3 inwestycje jednocześnie. Duży potencjał.", tags: "B2B, nieruchomości, duży klient" } }),
    prisma.contact.create({ data: { firstName: "Ewa", lastName: "Woźniak", phone: "+48 604 123 456", company: "Przedszkole Bajkowy Świat", position: "Dyrektor", email: "e.wozniak@bajkowyswiat.edu.pl", preCallNote: "Prywatne przedszkole, 80 dzieci. Szuka systemu do komunikacji z rodzicami.", tags: "edukacja, SMB" } }),
  ]);

  console.log(`✅ Dodano ${contacts.length} kontaktów`);

  const list1 = await prisma.list.create({
    data: { name: "Poniedziałek 9.06 — B2B", description: "Ciepłe leady z segmentu B2B do pierwszego kontaktu" },
  });
  const list2 = await prisma.list.create({
    data: { name: "SMB — sklepy i usługi", description: "Małe firmy i jednoosobowe działalności" },
  });

  const [marek, anna, piotr, , tomasz, , krzysztof, , rafal] = contacts;
  const [, , , kasia, , monika, , joanna, , ewa] = contacts;

  await prisma.listContact.createMany({
    data: [
      { listId: list1.id, contactId: marek.id, order: 0 },
      { listId: list1.id, contactId: anna.id, order: 1 },
      { listId: list1.id, contactId: piotr.id, order: 2 },
      { listId: list1.id, contactId: tomasz.id, order: 3 },
      { listId: list1.id, contactId: krzysztof.id, order: 4 },
      { listId: list1.id, contactId: rafal.id, order: 5 },
    ],
  });

  await prisma.listContact.createMany({
    data: [
      { listId: list2.id, contactId: kasia.id, order: 0 },
      { listId: list2.id, contactId: monika.id, order: 1 },
      { listId: list2.id, contactId: joanna.id, order: 2 },
      { listId: list2.id, contactId: ewa.id, order: 3 },
    ],
  });

  console.log(`✅ Dodano 2 listy z kontaktami`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
