import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";



export class GoogleAuthGuard extends AuthGuard('google') {}