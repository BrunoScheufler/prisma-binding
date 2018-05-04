import { TypescriptGenerator } from 'graphql-binding'
import { printSchema } from 'graphql'

export class PrismaTypescriptGenerator extends TypescriptGenerator {
  constructor(options) {
    super(options)
  }
  render() {
    return this.compile`\
${this.renderImports()}

interface BindingInstance {
  query: ${this.renderQueries()}
  mutation: ${this.renderMutations()}
  subscription: ${this.renderSubscriptions()}
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
}

interface BindingConstructor<T> {
  new(options: BasePrismaOptions): T
}
/**
 * Type Defs
*/

${this.renderTypedefs()}

${this.renderExports()}

/**
 * Types
*/

${this.renderTypes()}`
  }
  renderImports() {
    return `\
import { GraphQLResolveInfo } from 'graphql'
import { makePrismaBindingClass, BasePrismaOptions } from 'prisma-binding'`
  }
  renderExports() {
    return `export const Prisma = makePrismaBindingClass<BindingConstructor<BindingInstance>>({typeDefs})`
  }
  renderTypedefs() {
    return (
      'const typeDefs = `' + printSchema(this.schema).replace(/`/g, '\\`') + '`'
    )
  }
}
