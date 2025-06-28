import { Resolver, FieldResolver, Root } from "type-graphql";
import { Quote } from "../schema/Quote";
import { QuoteProduct } from "../schema/QuoteProduct";

@Resolver(() => Quote)
export class QuoteFieldResolver {
  @FieldResolver(() => Number, { nullable: true })
  async subTotal(@Root() quote: Quote): Promise<number> {
    if (!quote.items || quote.items.length === 0) {
      return 0;
    }
    
    return quote.items.reduce((total, item) => {
      return total + item.quantity * item.product.salesPrice;
    }, 0);
  }

  @FieldResolver(() => Number, { nullable: true })
  async total(@Root() quote: Quote): Promise<number> {
    const subTotal = await this.subTotal(quote);
    const tax = quote.tax || 0;
    return subTotal + tax;
  }
} 