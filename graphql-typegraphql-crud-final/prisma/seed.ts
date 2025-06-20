// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Nếu muốn xóa hết dữ liệu cũ, bạn có thể thêm lần lượt deleteMany(),
  // nhưng lưu ý thứ tự: bảng con → bảng cha để không vi phạm FK.

  // VD: Nếu bạn có bảng child reference tới bảng parent,
  // trước hết delete hết bảng child, rồi table parent.

  // Ví dụ (nếu cần dọn sạch hoàn toàn):
  // await prisma.deal.deleteMany();
  // await prisma.dealStage.deleteMany();
  // await prisma.contact.deleteMany();
  // await prisma.company.deleteMany();
  // await prisma.user.deleteMany();
  // …và tương tự delete các bảng khác…

  // 1. User
  await prisma.user.createMany({
    data: [
      { name: "Alice",   email: "alice@example.com",   password: "pass1", avatarUrl: "https://example.com/alice.png",   role: "admin", jobTitle: "Manager" },
      { name: "Bob",     email: "bob@example.com",     password: "pass2", avatarUrl: "https://example.com/bob.png",     role: "user",  jobTitle: "Developer" },
      { name: "Charlie", email: "charlie@example.com", password: "pass3", avatarUrl: "https://example.com/charlie.png", role: "user",  jobTitle: "Designer" },
      { name: "David",   email: "david@example.com",   password: "pass4", avatarUrl: "https://example.com/david.png",   role: "user",  jobTitle: "QA" },
      { name: "Eve",     email: "eve@example.com",     password: "pass5", avatarUrl: "https://example.com/eve.png",     role: "user",  jobTitle: "Support" },
    ],
    skipDuplicates: true,
  });

  // 2. Company
  await prisma.company.createMany({
    data: [
      { name: "Acme Corp", industry: "Tech",      description: "A tech company",  avatarUrl: "https://example.com/acme.png",    website: "https://acme.com",    totalRevenue: 100000, companySize: "100-500",  businessType: "B2B", address: "123 Acme St", city: "New York", country: "USA",  salesOwnerId: 1 },
      { name: "Beta Ltd", industry: "Finance",   description: "A finance company", avatarUrl: "https://example.com/beta.png",    website: "https://beta.com",    totalRevenue: 200000, companySize: "50-100",   businessType: "B2C", address: "456 Beta Ave", city: "London",    country: "UK",   salesOwnerId: 2 },
      { name: "Gamma Inc", industry: "Health",   description: "A health company",  avatarUrl: "https://example.com/gamma.png",   website: "https://gamma.com",   totalRevenue: 300000, companySize: "200-1000", businessType: "B2B", address: "789 Gamma Rd", city: "Berlin",    country: "Germany", salesOwnerId: 3 },
      { name: "Delta LLC", industry: "Retail",   description: "A retail company",  avatarUrl: "https://example.com/delta.png",   website: "https://delta.com",   totalRevenue: 400000, companySize: "10-50",    businessType: "B2C", address: "101 Delta Blvd", city: "Paris",     country: "France", salesOwnerId: 4 },
      { name: "Epsilon PLC", industry: "Education", description: "An education company", avatarUrl: "https://example.com/epsilon.png", website: "https://epsilon.com", totalRevenue: 500000, companySize: "500-2000", businessType: "B2B", address: "202 Epsilon Sq", city: "Tokyo", country: "Japan", salesOwnerId: 5 },
    ],
    skipDuplicates: true,
  });

  // 3. Contact
  await prisma.contact.createMany({
    data: [
      { name: "Contact 1", email: "c1@example.com", phone: "111-111-1111", description: "Main contact", companyId: 1, status: "active",   jobTitle: "CEO", avatarUrl: "https://example.com/contact1.png", salesOwnerId: 1 },
      { name: "Contact 2", email: "c2@example.com", phone: "222-222-2222", description: "Secondary",    companyId: 2, status: "inactive", jobTitle: "CTO", avatarUrl: "https://example.com/contact2.png", salesOwnerId: 2 },
      { name: "Contact 3", email: "c3@example.com", phone: "333-333-3333", description: "Support",      companyId: 3, status: "active",   jobTitle: "CFO", avatarUrl: "https://example.com/contact3.png", salesOwnerId: 3 },
      { name: "Contact 4", email: "c4@example.com", phone: "444-444-4444", description: "Sales",        companyId: 4, status: "active",   jobTitle: "COO", avatarUrl: "https://example.com/contact4.png", salesOwnerId: 4 },
      { name: "Contact 5", email: "c5@example.com", phone: "555-555-5555", description: "HR",           companyId: 5, status: "inactive", jobTitle: "CMO", avatarUrl: "https://example.com/contact5.png", salesOwnerId: 5 },
    ],
    skipDuplicates: true,
  });

  // 4. DealStage
  await prisma.dealStage.createMany({
    data: [
      { title: "Lead",       order: 1, color: "gray" },
      { title: "Qualified",  order: 2, color: "blue" },
      { title: "Proposal",   order: 3, color: "green" },
      { title: "Negotiation",order: 4, color: "yellow" },
      { title: "Closed",     order: 5, color: "red" },
    ],
    skipDuplicates: true,
  });

  // 5. Deal
  await prisma.deal.createMany({
    data: [
      { title: "Deal 1", amount: 1000, description: "First deal",     stageId: 1, companyId: 1, dealContactId: 1, dealOwnerId: 1 },
      { title: "Deal 2", amount: 2000, description: "Second deal",    stageId: 2, companyId: 2, dealContactId: 2, dealOwnerId: 2 },
      { title: "Deal 3", amount: 3000, description: "Third deal",     stageId: 3, companyId: 3, dealContactId: 3, dealOwnerId: 3 },
      { title: "Deal 4", amount: 4000, description: "Fourth deal",    stageId: 4, companyId: 4, dealContactId: 4, dealOwnerId: 4 },
      { title: "Deal 5", amount: 5000, description: "Fifth deal",     stageId: 5, companyId: 5, dealContactId: 5, dealOwnerId: 5 },
    ],
    skipDuplicates: true,
  });

  // 6. Category
  await prisma.category.createMany({
    data: [
      { title: "Cat 1" },
      { title: "Cat 2" },
      { title: "Cat 3" },
      { title: "Cat 4" },
      { title: "Cat 5" },
    ],
    skipDuplicates: true,
  });

  // 7. Product
  await prisma.product.createMany({
    data: [
      { title: "Product 1", description: "Desc 1", unitPrice: 10, categoryId: 1 },
      { title: "Product 2", description: "Desc 2", unitPrice: 20, categoryId: 2 },
      { title: "Product 3", description: "Desc 3", unitPrice: 30, categoryId: 3 },
      { title: "Product 4", description: "Desc 4", unitPrice: 40, categoryId: 4 },
      { title: "Product 5", description: "Desc 5", unitPrice: 50, categoryId: 5 },
    ],
    skipDuplicates: true,
  });

  // 8. Quote
  await prisma.quote.createMany({
    data: [
      { title: "Quote 1", status: "DRAFT", description: "Q1", subTotal: 100, total: 110, tax: 10, companyId: 1, salesOwnerId: 1, contactId: 1 },
      { title: "Quote 2", status: "DRAFT", description: "Q2", subTotal: 200, total: 220, tax: 20, companyId: 2, salesOwnerId: 2, contactId: 2 },
      { title: "Quote 3", status: "DRAFT", description: "Q3", subTotal: 300, total: 330, tax: 30, companyId: 3, salesOwnerId: 3, contactId: 3 },
      { title: "Quote 4", status: "DRAFT", description: "Q4", subTotal: 400, total: 440, tax: 40, companyId: 4, salesOwnerId: 4, contactId: 4 },
      { title: "Quote 5", status: "DRAFT", description: "Q5", subTotal: 500, total: 550, tax: 50, companyId: 5, salesOwnerId: 5, contactId: 5 },
    ],
    skipDuplicates: true,
  });

  // 9. QuoteProduct
  await prisma.quoteProduct.createMany({
    data: [
      { quoteId: 1, productId: 1, quantity: 2, discount: 10, totalPrice: 18 },
      { quoteId: 1, productId: 2, quantity: 1, discount: 5, totalPrice: 19 },
      { quoteId: 2, productId: 2, quantity: 3, discount: 15, totalPrice: 51 },
      { quoteId: 2, productId: 3, quantity: 2, discount: 0, totalPrice: 60 },
      { quoteId: 3, productId: 3, quantity: 1, discount: 20, totalPrice: 24 },
      { quoteId: 3, productId: 4, quantity: 4, discount: 10, totalPrice: 144 },
      { quoteId: 4, productId: 4, quantity: 2, discount: 5, totalPrice: 76 },
      { quoteId: 4, productId: 5, quantity: 3, discount: 15, totalPrice: 127.5 },
      { quoteId: 5, productId: 5, quantity: 1, discount: 0, totalPrice: 50 },
      { quoteId: 5, productId: 1, quantity: 5, discount: 10, totalPrice: 45 },
    ],
    skipDuplicates: true,
  });

  // 10. Project
  await prisma.project.createMany({
    data: [
      { name: "Project 1", description: "Desc 1", createdById: 1 },
      { name: "Project 2", description: "Desc 2", createdById: 2 },
      { name: "Project 3", description: "Desc 3", createdById: 3 },
      { name: "Project 4", description: "Desc 4", createdById: 4 },
      { name: "Project 5", description: "Desc 5", createdById: 5 },
    ],
    skipDuplicates: true,
  });

  // 11. EventCategory
  await prisma.eventCategory.createMany({
    data: [
      { title: "EventCat 1" },
      { title: "EventCat 2" },
      { title: "EventCat 3" },
      { title: "EventCat 4" },
      { title: "EventCat 5" },
    ],
    skipDuplicates: true,
  });

  // 12. Event
  const now = new Date();
  await prisma.event.createMany({
    data: [
      { title: "Event 1", startDate: now, description: "E1", color: "red",    createdById: 1, categoryId: 1 },
      { title: "Event 2", startDate: now, description: "E2", color: "blue",   createdById: 2, categoryId: 2 },
      { title: "Event 3", startDate: now, description: "E3", color: "green",  createdById: 3, categoryId: 3 },
      { title: "Event 4", startDate: now, description: "E4", color: "yellow", createdById: 4, categoryId: 4 },
      { title: "Event 5", startDate: now, description: "E5", color: "gray",   createdById: 5, categoryId: 5 },
    ],
    skipDuplicates: true,
  });

  // 13. TaskStage
  await prisma.taskStage.createMany({
    data: [
      { title: "Todo",        order: 1, color: "gray" },
      { title: "In Progress", order: 2, color: "blue" },
      { title: "Review",      order: 3, color: "green" },
      { title: "Done",        order: 4, color: "yellow" },
      { title: "Blocked",     order: 5, color: "red" },
    ],
    skipDuplicates: true,
  });

  // 14. Task
  await prisma.task.createMany({
    data: [
      { title: "Task 1", description: "T1", status: "todo",        dueDate: now, completed: false, stageId: 1, projectId: 1 },
      { title: "Task 2", description: "T2", status: "in_progress", dueDate: now, completed: false, stageId: 2, projectId: 2 },
      { title: "Task 3", description: "T3", status: "review",      dueDate: now, completed: false, stageId: 3, projectId: 3 },
      { title: "Task 4", description: "T4", status: "done",        dueDate: now, completed: true,  stageId: 4, projectId: 4 },
      { title: "Task 5", description: "T5", status: "blocked",     dueDate: now, completed: false, stageId: 5, projectId: 5 },
    ],
    skipDuplicates: true,
  });

  // 15. Checklist
  await prisma.checklist.createMany({
    data: [
      { title: "Checklist 1", checked: false, taskId: 1 },
      { title: "Checklist 2", checked: true,  taskId: 2 },
      { title: "Checklist 3", checked: false, taskId: 3 },
      { title: "Checklist 4", checked: true,  taskId: 4 },
      { title: "Checklist 5", checked: false, taskId: 5 },
    ],
    skipDuplicates: true,
  });

  // 16. Note
  await prisma.note.createMany({
    data: [
      { note: "Note 1", companyId: 1, contactId: 1, createdById: 1 },
      { note: "Note 2", companyId: 2, contactId: 2, createdById: 2 },
      { note: "Note 3", companyId: 3, contactId: 3, createdById: 3 },
      { note: "Note 4", companyId: 4, contactId: 4, createdById: 4 },
      { note: "Note 5", companyId: 5, contactId: 5, createdById: 5 },
    ],
    skipDuplicates: true,
  });

  // 17. Notification
  await prisma.notification.createMany({
    data: [
      { title: "Notify 1", message: "Message 1", read: false, userId: 1 },
      { title: "Notify 2", message: "Message 2", read: true,  userId: 2 },
      { title: "Notify 3", message: "Message 3", read: false, userId: 3 },
      { title: "Notify 4", message: "Message 4", read: true,  userId: 4 },
      { title: "Notify 5", message: "Message 5", read: false, userId: 5 },
    ],
    skipDuplicates: true,
  });

  // 18. Token
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  await prisma.token.createMany({
    data: [
      { token: "token1", type: "access",  expires, blacklisted: false, userId: 1 },
      { token: "token2", type: "refresh", expires, blacklisted: false, userId: 2 },
      { token: "token3", type: "access",  expires, blacklisted: false, userId: 3 },
      { token: "token4", type: "refresh", expires, blacklisted: false, userId: 4 },
      { token: "token5", type: "access",  expires, blacklisted: false, userId: 5 },
    ],
    skipDuplicates: true,
  });

  // 19. Comment
  await prisma.comment.createMany({
    data: [
      { comment: "Comment 1", createdById: 1 },
      { comment: "Comment 2", createdById: 2 },
      { comment: "Comment 3", createdById: 3 },
      { comment: "Comment 4", createdById: 4 },
      { comment: "Comment 5", createdById: 5 },
    ],
    skipDuplicates: true,
  });

  // 20. Audit
  await prisma.audit.createMany({
    data: [
      { action: "Create", targetEntity: "User",    targetId: 1, changes: {}, userId: 1 },
      { action: "Update", targetEntity: "User",    targetId: 2, changes: {}, userId: 2 },
      { action: "Delete", targetEntity: "User",    targetId: 3, changes: {}, userId: 3 },
      { action: "Create", targetEntity: "Company", targetId: 1, changes: {}, userId: 4 },
      { action: "Update", targetEntity: "Company", targetId: 2, changes: {}, userId: 5 },
    ],
    skipDuplicates: true,
  });

  // 21. Todo
  await prisma.todo.createMany({
    data: [
      { title: "Todo 1", content: "Content 1" },
      { title: "Todo 2", content: "Content 2" },
      { title: "Todo 3", content: "Content 3" },
      { title: "Todo 4", content: "Content 4" },
      { title: "Todo 5", content: "Content 5" },
    ],
    skipDuplicates: true,
  });

  // 22. Many-to-many: Task ↔ Users
  await prisma.task.update({
    where: { id: 1 },
    data: { users: { connect: [{ id: 1 }, { id: 2 }] } },
  });
  await prisma.task.update({
    where: { id: 2 },
    data: { users: { connect: [{ id: 2 }, { id: 3 }] } },
  });
  await prisma.task.update({
    where: { id: 3 },
    data: { users: { connect: [{ id: 3 }, { id: 4 }] } },
  });
  await prisma.task.update({
    where: { id: 4 },
    data: { users: { connect: [{ id: 4 }, { id: 5 }] } },
  });
  await prisma.task.update({
    where: { id: 5 },
    data: { users: { connect: [{ id: 5 }, { id: 1 }] } },
  });

  // 23. Many-to-many: Event ↔ Participants
  await prisma.event.update({
    where: { id: 1 },
    data: { participants: { connect: [{ id: 1 }, { id: 2 }] } },
  });
  await prisma.event.update({
    where: { id: 2 },
    data: { participants: { connect: [{ id: 2 }, { id: 3 }] } },
  });
  await prisma.event.update({
    where: { id: 3 },
    data: { participants: { connect: [{ id: 3 }, { id: 4 }] } },
  });
  await prisma.event.update({
    where: { id: 4 },
    data: { participants: { connect: [{ id: 4 }, { id: 5 }] } },
  });
  await prisma.event.update({
    where: { id: 5 },
    data: { participants: { connect: [{ id: 5 }, { id: 1 }] } },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
