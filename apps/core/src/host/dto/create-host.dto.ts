import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsNotEmpty, IsArray, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { HostType } from 'database/enitity/host/Host.entity';
import { YesNo } from 'database/enitity/host/HostTax.entity';
import { HostContactType } from 'database/enitity/host/HostContact.entity';

export class UpdateContactDto {
    @IsEnum(HostContactType)
    contactType: HostContactType;

    @IsString()
    @IsNotEmpty()
    contactName: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class UpdateTaxDto {
    vatResponsible: YesNo;
    simplifiedTaxRegime: YesNo;
    consumptionTax: YesNo;
    sourceWithholdingApply: YesNo;
    sourceWithholdingPercentage: number;
    reteicaApply: YesNo;
    reteicaPercentage: number;
    reteivaApply: YesNo;
}

export class UpdateBankDto {
    bank: string;
    accountType: string;
    accountNumber: string;
    accountHolder: string;
    idDocumentType: string;
    idDocumentNumber: string;
}

export class UpdateBasicDto {
    tradeName: string;
    corporateName: string;
    identificationNumber: string;
    taxIdNumber: string;
    legalRepresentative: string;
    contacts: UpdateContactDto[];
}

export class CreateHostDto {
    processingPolicyTimestamp: string;
    hostType: HostType;

}

export class UpdateHostTerm {
    contractAcceptanceTimestamp: string;
}
