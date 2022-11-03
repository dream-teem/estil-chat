import { PaginationQueryDto } from "@/common/dto/pagination.query.dto";
import { Transform } from "class-transformer";
import {   IsBoolean, IsOptional } from "class-validator";

export class UserProductsQueryDto extends PaginationQueryDto{
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    isSold?: boolean;
    
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    isLiked?: boolean;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    isSelling?: boolean;
}